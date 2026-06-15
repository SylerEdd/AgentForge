import { useState } from "react";
import { runProjectTests } from "../api/projectsApi";
import type { SavedProject, TestRunResult } from "../types";
import OutputCode from "./OutputCode";
import OutputList from "./OutputList";

type ProjectOutputProps = {
  project: SavedProject;
};

function ProjectOutput({ project }: ProjectOutputProps) {
  const [testResult, setTestResult] = useState<TestRunResult | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testError, setTestError] = useState("");

  async function handleRunTests() {
    setIsRunningTests(true);
    setTestError("");
    setTestResult(null);

    try {
      const result = await runProjectTests(project.id);
      setTestResult(result);
    } catch (error) {
      setTestError("Could not run tests. Check the backend terminal.");
    } finally {
      setIsRunningTests(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
        <p className="text-sm text-slate-400">Project idea</p>
        <h2 className="mt-2 text-2xl font-bold">{project.idea}</h2>
        <p className="mt-2 text-sm text-slate-400">
          Created {new Date(project.createdAt).toLocaleString()}
        </p>
      </section>

      <OutputList title="Requirements" items={project.requirements} />
      <OutputList title="Classes" items={project.classes} />

      {project.sourceFiles.map((file) => (
        <OutputCode
          key={file.fileName}
          title={`Java Source - ${file.fileName}`}
          code={file.content}
        />
      ))}

      {project.testFiles.map((file) => (
        <OutputCode
          key={file.fileName}
          title={`JUnit Test - ${file.fileName}`}
          code={file.content}
        />
      ))}

      <OutputList title="Review Notes" items={project.review} />

      <button
        onClick={handleRunTests}
        disabled={isRunningTests}
        className="mt-4 rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-slate-950 disabled:bg-slate-600"
      >
        {isRunningTests ? "Running Tests..." : "Run Tests"}
      </button>

      {testError && (
        <div className="mt-4 rounded-lg border border-red-500 bg-red-950 p-4 text-red-200">
          {testError}
        </div>
      )}

      {testResult && (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-4">
          <p
            className={
              testResult.success ? "text-emerald-300" : "text-yellow-300"
            }
          >
            {testResult.success ? "Tests passed" : "Tests not executed yet"}
          </p>
          <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
            {testResult.output}
          </pre>
        </div>
      )}
    </div>
  );
}

export default ProjectOutput;
