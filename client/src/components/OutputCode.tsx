type OutputCodeProps = {
  title: string;
  code: string;
};

function OutputCode({ title, code }: OutputCodeProps) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-xl font-semibold">{title}</h2>

      <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-emerald-200">
        <code>{code}</code>
      </pre>
    </section>
  );
}

export default OutputCode;
