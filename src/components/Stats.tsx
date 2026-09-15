const stats = [
  { value: 'Daily', label: 'Checks against the official feed' },
  { value: 'England', label: 'Apprenticeships covered' },
  { value: '60s', label: 'To set up your alert' },
  { value: 'Free', label: 'For job seekers' },
];

export default function Stats() {
  return (
    <section className="py-16 border-t border-line/60 bg-gradient-to-br from-ink via-[#241b4d] to-[#4c1d95] text-paper relative overflow-hidden">
      <div className="absolute -top-16 left-1/4 w-72 h-72 wash wash-safety [--wash-alpha:0.2] pointer-events-none" aria-hidden />
      <div className="absolute -bottom-16 right-1/4 w-72 h-72 wash wash-teal [--wash-alpha:0.2] pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <dt className="font-display font-extrabold text-4xl sm:text-5xl text-safety tracking-tight drop-shadow-[0_2px_8px_rgba(255,90,31,0.5)]">{s.value}</dt>
              <dd className="mt-2 text-sm text-paper/70 leading-snug max-w-[12rem] mx-auto lg:mx-0">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
