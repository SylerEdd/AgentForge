import { useEffect, useState } from "react";
import { fetchProjectTestRuns, runProjectTests } from "../api/projectsApi";
import type { SavedProject, TestRun } from "../types";
import OutputCode from "./OutputCode";
import OutputList from "./OutputList";

type ProjectOutputProps = {
  project: SavedProject;
};

function ProjectOutput({ project }: ProjectOutputProps) {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testError, setTestError] = useState("");

  useEffect(() => {
    loadTestRuns();
  }, [project.id]);

  async function loadTestRuns() {
    try {
      const runs = await fetchProjectTestRuns(project.id);
      setTestRuns(runs);
    } catch (error) {
      setTestError("Could not load previous test runs.");
    }
  }

  async function handleRunTests() {
    setIsRunningTests(true);
    setTestError("");

    try {
      const savedRun = await runProjectTests(project.id);
      setTestRuns((currentRuns) => [savedRun, ...currentRuns]);
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

      {testRuns.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-700 bg-slate-950 p-4">
          <h3 className="font-semibold">Test Runs</h3>

          <div className="mt-3 space-y-4">
            {testRuns.map((run) => (
              <div
                key={run.id}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={
                      run.success ? "test-emerald-300" : "test-red-300"
                    }
                  >
                    {run.success ? "Test passed" : "Tests failed"}
                  </p>
                  <p className="text-sm text-slate-400">
                    {new Date(run.createdAt).toLocaleString()}
                  </p>
                </div>
                <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-sm text-slate-300">
                  {run.output}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectOutput;
