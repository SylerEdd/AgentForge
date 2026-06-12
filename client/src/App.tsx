import { useState, type FormEventHandler } from "react";

type GeneratedProject = {
  requirements: string[];
  classes: string[];
  code: string;
  tests: string;
  review: string[];
};

function App() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<GeneratedProject | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!idea.trim()) {
      setError("Please enter a Java project idea.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/projects/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idea }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setResult(data);
    } catch (error) {
      setError("Could not connect to the backend server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-bold">AgentForge</h1>

        <p className="mt-3 text-slate-300">
          Describe a Java project idea and AgentForge will return fake agent
          output for requirements, classes, code, tests, and review notes.
        </p>

        <form onSubmit={handleGenerate} className="mt-8 space-y-4">
          <textarea
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="Example: Create a simple bank account system"
            className="min-h-40 w-full rounded-lg border border-slate-700 bg-slate-900 p-4 text-white outline-none focus:border-emerald-400"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-slate-950 disabled:bg-slate-600"
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-red-500 bg-red-950 p-4 text-red-200">
            {error}
          </div>
        )}

        {result && (
          <section className="mt-8 space-y-6">
            <OutputList title="Requirements" items={result.requirements} />
            <OutputList title="Classes" items={result.classes} />
            <OutputCode title="Java Code" code={result.code} />
            <OutputCode title="JUnit Tests" code={result.tests} />
            <OutputList title="Review Notes" items={result.review} />
          </section>
        )}
      </div>
    </main>
  );
}

type OutputListProps = {
  title: string;
  items: string[];
};

function OutputList({ title, items }: OutputListProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>

      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

type OutputCodeProps = {
  title: string;
  code: string;
};

function OutputCode({ title, code }: OutputCodeProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>

      <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-emerald-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default App;
