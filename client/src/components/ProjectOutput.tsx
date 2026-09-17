import { useEffect, useState } from "react";
import {
  applyProjectFixes,
  downloadProject,
  fetchProjectRevisions,
  fetchProjectTestRuns,
  runProjectTests,
} from "../api/projectsApi";
import type { ProjectRevision, SavedProject, TestRun } from "../types";
import OutputCode from "./OutputCode";
import OutputList from "./OutputList";

type ProjectOutputProps = {
  project: SavedProject;
  onProjectUpdated: (project: SavedProject) => void;
};

function ProjectOutput({ project, onProjectUpdated }: ProjectOutputProps) {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testError, setTestError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isApplyingFixes, setIsApplyingFixes] = useState(false);
  const [fixError, setFixError] = useState("");
  const [changeSummary, setChangeSummary] = useState<string[]>([]);
  const [revisions, setRevisions] = useState<ProjectRevision[]>([]);

  useEffect(() => {
    setFixError("");
    setChangeSummary([]);
    loadTestRuns();
    loadRevisions();
  }, [project.id]);

  async function loadTestRuns() {
    try {
      const runs = await fetchProjectTestRuns(project.id);
      setTestRuns(runs);
    } catch (error) {
      setTestError("Could not load previous test runs.");
    }
  }

  async function loadRevisions() {
    try {
      const projectRevisions = await fetchProjectRevisions(project.id);
      setRevisions(projectRevisions);
    } catch (error) {
      setTestError("Could not load project revisions history.");
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

  async function handleDownload() {
    setIsDownloading(true);
    setTestError("");

    try {
      await downloadProject(project.id, project.idea);
    } catch {
      setTestError("Could not download the generated project.");
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleApplyFixes() {
    setIsApplyingFixes(true);
    setFixError("");
    setChangeSummary([]);

    try {
      const result = await applyProjectFixes(project.id);

      setChangeSummary(result.changeSummary);
      onProjectUpdated(result.project);
      await loadRevisions();
    } catch (error) {
      setFixError("Could not apply fixes. Check the backend terminal.");
    } finally {
      setIsApplyingFixes(false);
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
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleRunTests}
          disabled={isRunningTests}
          className="mt-4 rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-slate-950 disabled:bg-slate-600"
        >
          {isRunningTests ? "Running Tests..." : "Run Tests"}
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="mt-4 rounded-lg border border-emerald-400 px-5 py-3 font-semibold text-emerald-300 hover:bg-emerald-400/10 disabled:border-slate-600 disabled:text-slate-500"
        >
          {isDownloading ? "Preparing ZIP..." : "Download ZIP"}
        </button>
        <button
          onClick={handleApplyFixes}
          disabled={isApplyingFixes || isRunningTests}
          className="mt-4 rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-400 disabled:bg-slate-600"
        >
          {isApplyingFixes ? "Applying Fixes..." : "Apply Review Fixes"}
        </button>
      </div>
      {fixError && (
        <div className="mt-4 rounded-lg border border-red-500 bg-red-950 p-4 text-red-200">
          {fixError}
        </div>
      )}
      {changeSummary.length > 0 && (
        <OutputList title="Latest Fix Summary" items={changeSummary} />
      )}
      {revisions.length > 0 && (
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold">Revision History</h3>

          <div className="mt-4 divide-y divide-slate-800">
            {revisions.map((revision) => (
              <div key={revision.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-emerald-300">
                    Version {revision.version}
                  </p>

                  <p className="text-sm text-slate-400">
                    {new Date(revision.createdAt).toLocaleString()}
                  </p>
                </div>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  {revision.changeSummary.map((change, index) => (
                    <li key={`${revision.id}-${index}`} className="break-words">
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {testError && (
        <div className="mt-4 rounded-lg border border-red-500 bg-red-950 p-4 text-red-200">
          {testError}
        </div>
      )}

      {testRuns.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-4">
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
                      run.success ? "text-emerald-300" : "text-red-300"
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
