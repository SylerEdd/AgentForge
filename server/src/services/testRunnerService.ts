import { execFile } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type {
  GeneratedFile,
  TestRunResult,
} from "../types/generatedProject.js";
import { createPomXml } from "../utils/createPomXml.js";

type RunnableProject = {
  sourceFiles: unknown;
  testFiles: unknown;
};

const MAVEN_IMAGE = "agentforge-java-runner:1.0";

export async function runGeneratedProjectTests(
  project: RunnableProject,
): Promise<TestRunResult> {
  const sourceFiles = parseGeneratedFiles(project.sourceFiles, "sourceFiles");
  const testFiles = parseGeneratedFiles(project.testFiles, "testFiles");

  const tempProjectDir = await mkdtemp(path.join(tmpdir(), "agentforge-"));

  try {
    await createMavenProject(tempProjectDir, sourceFiles, testFiles);
    return await runMavenTestsInDocker(tempProjectDir);
  } finally {
    await rm(tempProjectDir, {
      recursive: true,
      force: true,
    });
  }
}

function parseGeneratedFiles(value: unknown, label: string): GeneratedFile[] {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }

  return value.map((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("fileName" in item) ||
      !("content" in item) ||
      typeof item.fileName !== "string" ||
      typeof item.content !== "string"
    ) {
      throw new Error(`${label} contains an invalid file.`);
    }

    return {
      fileName: sanitizeJavaFileName(item.fileName),
      content: item.content,
    };
  });
}

function sanitizeJavaFileName(fileName: string): string {
  const safeFileName = path.basename(fileName);

  if (!safeFileName.endsWith(".java")) {
    throw new Error("Generated file must end with .java.");
  }

  return safeFileName;
}

async function createMavenProject(
  projectDir: string,
  sourceFiles: GeneratedFile[],
  testFiles: GeneratedFile[],
) {
  const mainJavaDir = path.join(projectDir, "src", "main", "java");
  const testJavaDir = path.join(projectDir, "src", "test", "java");

  await mkdir(mainJavaDir, { recursive: true });
  await mkdir(testJavaDir, { recursive: true });

  await writeFile(path.join(projectDir, "pom.xml"), createPomXml());

  for (const file of sourceFiles) {
    await writeFile(path.join(mainJavaDir, file.fileName), file.content);
  }

  for (const file of testFiles) {
    await writeFile(path.join(testJavaDir, file.fileName), file.content);
  }
}

async function runMavenTestsInDocker(
  projectDir: string,
): Promise<TestRunResult> {
  return new Promise((resolve) => {
    execFile(
      "docker",
      [
        "run",
        "--rm",
        "--network", // network none gives no internet access
        "none",
        "--memory",
        "512m", // memory limit
        "--cpus",
        "1", // CPU limit at the moment (but change later)
        "--pids-limit",
        "128", //process limit (change later)
        "--cap-drop",
        "ALL", // cap drop all removes linux capabilities.
        "--security-opt",
        "no-new-privileges",
        "--read-only",
        "--tmpfs",
        "/tmp:rw,exec,nosuid,size=64m",
        "--tmpfs",
        "/home/runner/.m2:rw,nosuid,size=16m",
        "--env",
        "HOME=/home/runner",
        "--env",
        "MAVEN_CONFIG=/home/runner/.m2",
        "--env",
        "MAVEN_OPTS=-Djansi.force=false -Dstyle.color=never",
        "-v",
        `${projectDir}:/app`,
        "-w",
        "/app",
        MAVEN_IMAGE,
        "mvn",
        "-o",
        "-Dmaven.repo.local=/opt/maven-cache",
        "test",
      ],
      {
        timeout: 60000,
        maxBuffer: 1024 * 1024 * 5,
      },
      (error, stdout, stderr) => {
        const output = `${stdout}\n${stderr}`.trim();

        if (error?.killed) {
          resolve({
            success: false,
            output: "Test execution exceeded the 60-second time limit.",
          });
          return;
        }

        resolve({
          success: !error,
          output: output || "No Maven output was returned.",
        });
      },
    );
  });
}
