import type { SavedProject } from "../types";
import OutputCode from "./OutputCode";
import OutputList from "./OutputList";

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

export default ProjectOutput;
