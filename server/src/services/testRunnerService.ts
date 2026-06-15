import { execFile } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type {
  GeneratedFile,
  TestRunResult,
} from "../types/generatedProject.js";

type RunnableProject = {
  sourceFiles: unknown;
  testFiles: unknown;
};

const MAVEN_IMAGE = "maven:3.9-eclipse-temurin-17";

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

function createPomXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.agentforge</groupId>
  <artifactId>generated-project</artifactId>
  <version>1.0.0</version>

  <properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.junit.jupiter</groupId>
      <artifactId>junit-jupiter</artifactId>
      <version>5.10.2</version>
      <scope>test</scope>
    </dependency>
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>3.2.5</version>
      </plugin>
    </plugins>
  </build>
</project>`;
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
        "--memory",
        "512m",
        "--cpus",
        "1",
        "-v",
        `${projectDir}:/app`,
        "-w",
        "/app",
        MAVEN_IMAGE,
        "mvn",
        "test",
      ],
      {
        timeout: 60000,
        maxBuffer: 1024 * 1024 * 5,
      },
      (error, stdout, stderr) => {
        const output = `${stdout}\n${stderr}`.trim();

        resolve({
          success: !error,
          output: output || "No Maven output was returned.",
        });
      },
    );
  });
}
