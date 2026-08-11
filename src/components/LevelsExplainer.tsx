import Accordion, { AccordionEntry } from './Accordion';

const levels: AccordionEntry[] = [
  {
    q: 'Intermediate (Level 2)',
    a: "Roughly equivalent to 5 GCSE passes at grades 9–4 (A*–C). A common starting point if you're leaving school after Year 11.",
  },
  {
    q: 'Advanced (Level 3)',
    a: 'Roughly equivalent to two A-level passes. The most common apprenticeship level for 16–18 year olds.',
  },
  {
    q: 'Higher (Level 4–5)',
    a: "Roughly equivalent to a foundation degree, or the first year or two of university. Usually needs a Level 3 apprenticeship or equivalent to get onto.",
  },
  {
    q: 'Degree (Level 6–7)',
    a: "A full bachelor's or master's degree, gained on the job instead of studying full-time. Usually needs a Level 3 apprenticeship or equivalent to get onto.",
  },
];

export default function LevelsExplainer() {
  return (
    <section id="levels" className="relative py-20 sm:py-28 border-t border-line/60">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-safety">Apprenticeship levels</p>
          <h2 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            What "Advanced" or "Level 3" actually means.
          </h2>
          <p className="mt-4 text-lg text-ink-soft text-pretty">
            Every listing shows a level. Here's what each one means in plain English.
          </p>
        </div>

        <div className="mt-12">
          <Accordion items={levels} />
        </div>
      </div>
    </section>
  );
}
