import { FormEvent, useEffect, useState } from "react";

type SavedProject = {
  id: string;
  idea: string;
  requirements: string[];
  classes: string[];
  code: string;
  tests: string;
  review: string[];
  createdAt: string;
};

const API_URL = "http://localhost:4000";

function App() {
  const [idea, setIdea] = useState("");
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(
    null,
  );
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setIsLoadingHistory(true);

    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load project history.");
      }

      setSavedProjects(data);
    } catch (error) {
      setError("Could not load saved projects.");
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!idea.trim()) {
      setError("Please enter a Java project idea.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_URL}/api/projects/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setSelectedProject(data);
      setIdea("");
      await loadProjects();
    } catch (error) {
      setError("Could not generate the project. Check the backend terminal.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-6">
          <section>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              AgentForge v0.9
            </p>
            <h1 className="mt-2 text-4xl font-bold">AgentForge</h1>
            <p className="mt-3 text-slate-300">
              Generate Java project plans with a multi-agent AI workflow and
              save them to your project history.
            </p>
          </section>

          <form
            onSubmit={handleGenerate}
            className="rounded-lg border border-slate-800 bg-slate-900 p-5"
          >
            <label htmlFor="idea" className="font-semibold">
              Java project idea
            </label>

            <textarea
              id="idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              placeholder="Example: Create a simple bank account system"
              className="mt-3 min-h-36 w-full rounded-lg border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-emerald-400"
            />

            <button
              type="submit"
              disabled={isGenerating}
              className="mt-4 w-full rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-slate-950 disabled:bg-slate-600"
            >
              {isGenerating ? "Generating..." : "Generate Project"}
            </button>
          </form>

          {error && (
            <div className="rounded-lg border border-red-500 bg-red-950 p-4 text-red-200">
              {error}
            </div>
          )}

          <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Project History</h2>
              <button
                onClick={loadProjects}
                className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:border-emerald-400 hover:text-emerald-300"
              >
                Refresh
              </button>
            </div>

            {isLoadingHistory ? (
              <p className="mt-4 text-slate-400">Loading history...</p>
            ) : savedProjects.length === 0 ? (
              <p className="mt-4 text-slate-400">No saved projects yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {savedProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-left hover:border-emerald-400"
                  >
                    <p className="line-clamp-2 font-medium text-white">
                      {project.idea}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {new Date(project.createdAt).toLocaleString()}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>

        <section className="min-w-0">
          {!selectedProject ? (
            <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900 p-6 text-center text-slate-400">
              Generate a project or select one from history.
            </div>
          ) : (
            <ProjectOutput project={selectedProject} />
          )}
        </section>
      </div>
    </main>
  );
}

type ProjectOutputProps = {
  project: SavedProject;
};

function ProjectOutput({ project }: ProjectOutputProps) {
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
      <OutputCode title="Java Code" code={project.code} />
      <OutputCode title="JUnit Tests" code={project.tests} />
      <OutputList title="Review Notes" items={project.review} />
    </div>
  );
}

type OutputListProps = {
  title: string;
  items: string[];
};

function OutputList({ title, items }: OutputListProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>

      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

type OutputCodeProps = {
  title: string;
  code: string;
};

function OutputCode({ title, code }: OutputCodeProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>

      <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-emerald-200">
        <code>{code}</code>
      </pre>
    </section>
  );
}

export default App;
