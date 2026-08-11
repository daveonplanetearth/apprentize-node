import Accordion, { AccordionEntry } from './Accordion';

const faqs: AccordionEntry[] = [
  {
    q: 'Is Apprentize really free?',
    a: 'Yes — completely. There is no paid tier and no hidden cost. You enter your email, you get alerts, and that is it. We make nothing off your data.',
  },
  {
    q: 'Where does the apprenticeship data come from?',
    a: (
      <>
        We monitor the same official{' '}
        <a href="https://www.findapprenticeship.service.gov.uk" target="_blank" rel="noopener noreferrer" className="font-semibold text-teal hover:underline">
          Find An Apprenticeship
        </a>{' '}
        vacancy feed operated by the UK government. This covers apprenticeships in England only — we do not currently alert on roles in Scotland, Wales, or Northern Ireland. We do not scrape third-party job boards; only the public, official source.
      </>
    ),
  },
  {
    q: 'How is this different from the official Find An Apprenticeship alert?',
    a: 'The official service sends a single weekly email. Apprentize checks the feed every day and emails you the same day a matching vacancy opens. If a role is posted Monday, you hear about it Monday — not the following week.',
  },
  {
    q: 'How often will you email me?',
    a: 'At most once per day, and only when there is a new role that matches your criteria. If nothing new appears, you hear nothing. No "just checking in" emails.',
  },
  {
    q: 'Will you share or sell my email?',
    a: 'Never. Your email is used solely to deliver apprenticeship alerts. We do not share, sell, or pass your address to any third party. No spam, ever.',
  },
  {
    q: 'Does this cover the whole UK?',
    a: 'No. Apprentize alerts on apprenticeships in England only. The official Find An Apprenticeship feed we monitor covers English vacancies. If you are looking in Scotland, Wales, or Northern Ireland, Apprentize is not the right tool — try Apprenticeships.scot, Careers Wales, or nidirect respectively.',
  },
  {
    q: 'What do the apprenticeship levels mean?',
    a: (
      <div className="space-y-3">
        <p>Every listing shows a level. Here is what each one means in plain English:</p>
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
          <p className="text-sm font-bold uppercase tracking-widest text-safety">FAQ</p>
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
