const stats = [
  { value: 'Daily', label: 'Checks against the official feed' },
  { value: '0', label: 'Spam emails — ever' },
  { value: '60s', label: 'To set up your alert' },
  { value: 'Free', label: 'Now and always' },
];

export default function Stats() {
  return (
    <section className="py-16 border-t border-line/60 bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <dt className="font-display font-extrabold text-4xl sm:text-5xl text-safety tracking-tight">{s.value}</dt>
              <dd className="mt-2 text-sm text-paper/70 leading-snug max-w-[12rem] mx-auto lg:mx-0">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
