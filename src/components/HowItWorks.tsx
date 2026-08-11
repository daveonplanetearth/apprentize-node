import { Settings2, Filter, Mail } from 'lucide-react';

const steps = [
  {
    icon: Settings2,
    title: 'We monitor the source',
    body: 'Apprentize pulls from the same official Find An Apprenticeship vacancy feed every single day.',
  },
  {
    icon: Filter,
    title: 'We filter for your match',
    body: 'Tell us your region and distance you are willing to travel. We only flag roles that meet your criteria — you never wade through irrelevant listings.',
  },
  {
    icon: Mail,
    title: 'You get an email that day',
    body: 'The day a matching vacancy appears, you receive a clean, scannable email with a direct link to apply. Or just browse live listings yourself, any time.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28 border-t border-line/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-safety">How it works</p>
          <h2 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Three steps. Done in under a minute.
          </h2>
          <p className="mt-4 text-lg text-ink-soft text-pretty">
            Search live listings whenever you like, or set a free daily alert once and let new roles come to you. No account needed.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative rounded-2xl bg-card border border-line p-6 transition-all hover:border-ink/30 hover:shadow-[0_12px_40px_rgba(22,35,59,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center transition-transform group-hover:scale-105">
                  <step.icon className="w-5 h-5 text-safety" />
                </div>
                <span className="font-mono text-sm text-ink-soft font-semibold">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-display font-bold text-ink text-xl">{step.title}</h3>
              <p className="mt-2 text-ink-soft leading-relaxed text-[15px]">{step.body}</p>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-3 w-6 h-px bg-line" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
