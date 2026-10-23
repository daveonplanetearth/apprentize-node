import Accordion, { AccordionEntry } from './Accordion';

const faqs: AccordionEntry[] = [
  {
    q: 'Is Apprentize really free?',
    a: "Yes. Searching live apprenticeships and jobs and getting daily email alerts is free — there's no card to enter and no hidden cost, and we'll never sell your data. If we ever add optional paid extras, the alerts you've signed up for stay free.",
  },
  {
    q: 'What kinds of roles does Apprentize show?',
    a: 'Two types: apprenticeships from the official Find An Apprenticeship feed (structured training programmes with a wage and a recognised qualification), and entry-level jobs from job boards across the UK (regular paid roles with no attached training). Both appear in search results and daily alerts, so you can find an apprenticeship, a job to earn now, or both.',
  },
  {
    q: 'Why should I look for a job as well as an apprenticeship?',
    a: 'The right apprenticeship might not open for weeks. A local job lets you start earning straight away — gaining experience, building your CV, and bringing in money while you wait for the apprenticeship that fits. When it opens, you are already in a stronger position to apply.',
  },
  {
    q: 'Where does the apprenticeship data come from?',
    a: (
      <>
        We monitor the same official{' '}
        <a href="https://www.findapprenticeship.service.gov.uk" target="_blank" rel="noopener noreferrer" className="font-semibold text-teal hover:underline">
          Find An Apprenticeship
        </a>{' '}
        vacancy feed operated by the UK government. This covers apprenticeships in England only. Job listings are sourced from job boards covering the UK. We do not scrape random third-party sites — only established, official sources.
      </>
    ),
  },
  {
    q: 'How is this different from the official Find An Apprenticeship alert?',
    a: 'The official service sends a single weekly email and only covers apprenticeships. Apprentize checks the feed every day, includes local jobs alongside apprenticeships, and emails you the same day a matching role opens. If a position is posted Monday, you hear about it Monday — not the following week.',
  },
  {
    q: 'How often will you email me?',
    a: 'At most once per day, and only when there is a new apprenticeship or job that matches your criteria. If nothing new appears, you hear nothing. No "just checking in" emails.',
  },
  {
    q: 'Will you share or sell my email?',
    a: 'Never. Your email is used solely to deliver apprenticeship and job alerts. We do not share, sell, or pass your address to any third party. No spam, ever.',
  },
  {
    q: 'Does this cover the whole UK?',
    a: 'Apprenticeship alerts cover England only — the official Find An Apprenticeship feed we monitor is for English vacancies. Job listings cover the wider UK. If you are looking for apprenticeships in Scotland, Wales, or Northern Ireland, try Apprenticeships.scot, Careers Wales, or nidirect respectively.',
  },
  {
    q: 'What do the apprenticeship levels mean?',
    a: (
      <div className="space-y-3">
        <p>Every apprenticeship listing shows a level. Here is what each one means in plain English:</p>
        <ul className="space-y-2.5">
          <li>
            <span className="font-semibold text-ink">Intermediate (Level 2)</span> — roughly equivalent to 5 GCSE passes at grades 9–4 (A*–C). A common starting point if you're leaving school after Year 11.
          </li>
          <li>
            <span className="font-semibold text-ink">Advanced (Level 3)</span> — roughly equivalent to two A-level passes. The most common apprenticeship level for 16–18 year olds.
          </li>
          <li>
            <span className="font-semibold text-ink">Higher (Level 4–5)</span> — roughly equivalent to a foundation degree, or the first year or two of university. Usually needs a Level 3 apprenticeship or equivalent to get onto.
          </li>
          <li>
            <span className="font-semibold text-ink">Degree (Level 6–7)</span> — a full bachelor's or master's degree, gained on the job instead of studying full-time. Usually needs a Level 3 apprenticeship or equivalent to get onto.
          </li>
        </ul>
      </div>
    ),
  },
  {
    q: 'How do I unsubscribe?',
    a: 'Every email includes a one-click unsubscribe link. You can also manage your preferences, unsubscribe, or permanently delete your account anytime from My Preferences.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="relative py-20 sm:py-28 border-t border-line/60">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <p className="inline-flex rounded-full glossy-pill px-3 py-1 text-sm font-bold uppercase tracking-widest text-safety">FAQ</p>
          <h2 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-12">
          <Accordion items={faqs} defaultOpenIndex={0} />
        </div>
      </div>
    </section>
  );
}
