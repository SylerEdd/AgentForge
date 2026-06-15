import type { SubmitEvent } from "react";

type ProjectFormProps = {
  idea: string;
  isGenerating: boolean;
  onIdeaChange: (idea: string) => void;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};

function ProjectForm({
  idea,
  isGenerating,
  onIdeaChange,
  onSubmit,
}: ProjectFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-slate-800 bg-slate-900 p-5"
    >
      <label htmlFor="idea" className="font-semibold">
        Java project idea
      </label>

      <textarea
        id="idea"
        value={idea}
        onChange={(event) => onIdeaChange(event.target.value)}
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
  );
}

export default ProjectForm;
