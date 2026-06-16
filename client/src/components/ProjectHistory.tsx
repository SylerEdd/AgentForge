import type { SavedProject } from "../types";

type ProjectHistoryProps = {
  projects: SavedProject[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectProject: (project: SavedProject) => void;
  onDeleteProject: (project: SavedProject) => void;
};

function ProjectHistory({
  projects,
  isLoading,
  onRefresh,
  onSelectProject,
  onDeleteProject,
}: ProjectHistoryProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Project History</h2>
        <button
          onClick={onRefresh}
          className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:border-emerald-400 hover:text-emerald-300"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <p className="mt-4 text-slate-400">Loading history...</p>
      ) : projects.length === 0 ? (
        <p className="mt-4 text-slate-400">No saved projects yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-slate-800 bg-slate-950 p-3 hover:"
              border-emerald-400
            >
              <button
                onClick={() => onSelectProject(project)}
                className="w-full text-left"
              >
                <p className="line-clamp-2 font-medium text-white">
                  {project.idea}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  {new Date(project.createdAt).toLocaleString()}
                </p>
              </button>
              <button
                onClick={() => onDeleteProject(project)}
                className="mt-3 rounded-md border border-red-500/40 px-3 py-1 text-sm text-red-300 hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectHistory;
