import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";
import { fetchProjects, generateProject } from "./api/projectsApi";
import ProjectForm from "./components/ProjectForm";
import ProjectHistory from "./components/ProjectHistory";
import ProjectOutput from "./components/ProjectOutput";
import type { SavedProject } from "./types";

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
      const projects = await fetchProjects();
      setSavedProjects(projects);
    } catch (error) {
      setError("Could not load saved projects");
    } finally {
      setIsLoadingHistory(false);
    }
  }

  async function handleGenerate(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!idea.trim()) {
      setError("Please enter a Java project idea.");
      return;
    }

    setIsGenerating(true);

    try {
      const generatedProject = await generateProject(idea);

      setSelectedProject(generatedProject);
      setIdea("");
    } catch (error) {
      setError("Could not generate the project. Check the backend terminal.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[380px_1fr]">
        <aside className="sapce-y-6">
          <section>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              AgentForge v1.1
            </p>
            <h1 className="mt-2 text-4xl font-bold">AgentForge</h1>
            <p className="mt-3 text-slate-300">
              Generate Java project plans with a multi-agent AI workflow and
              save them to your project history.
            </p>
          </section>

          <ProjectForm
            idea={idea}
            isGenerating={isGenerating}
            onIdeaChange={setIdea}
            onSubmit={handleGenerate}
          />

          {error && (
            <div className="rounded-lg border border-red-500 bg-red-950 p-4 text-red-200">
              {error}
            </div>
          )}

          <ProjectHistory
            projects={savedProjects}
            isLoading={isLoadingHistory}
            onRefresh={loadProjects}
            onSelectProject={setSelectedProject}
          />
        </aside>

        <section className="min-w-0">
          {!selectedProject ? (
            <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900 p-6 text-center text-slate-400">
              Generate a project or select on from history.
            </div>
          ) : (
            <ProjectOutput project={selectedProject} />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
