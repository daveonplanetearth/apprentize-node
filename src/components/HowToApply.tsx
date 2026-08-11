import Accordion, { AccordionEntry } from './Accordion';

const steps: AccordionEntry[] = [
  {
    q: 'How do I actually apply once I find a role I like?',
    a: "Every listing links straight to the employer's (or Find An Apprenticeship's) own application page — Apprentize doesn't run its own application form. Click through, and you apply exactly the same way as if you'd found the listing on gov.uk.",
  },
  {
    q: 'Do I need an Apprentize account to apply?',
    a: "No. Browsing and clicking through to apply needs no account at all. An account is only needed if you want daily email alerts, and even then it's just an email address — no password, no login.",
  },
  {
    q: "What happens after I click through to apply?",
    a: "You leave Apprentize and land on the employer's own application page, or Find An Apprenticeship's. From there, the process — CV, interview, offer — is between you and the employer, same as any other apprenticeship application.",
  },
  {
    q: "I signed up for alerts — what happens next?",
    a: 'Once a day, we check the official feed for new roles matching your postcode, radius, and age group, and email you a summary. You then click through and apply directly with the employer, same as browsing.',
  },
];

export default function HowToApply() {
  return (
    <section id="applying" className="relative py-20 sm:py-28 border-t border-line/60 bg-paper-deep/40">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-safety">Applying</p>
          <h2 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            How applying actually works.
          </h2>
          <p className="mt-4 text-lg text-ink-soft text-pretty">
            Apprentize helps you find the role. Here's exactly what happens once you click apply.
          </p>
        </div>

        <div className="mt-12">
          <Accordion items={steps} />
        </div>
      </div>
    </section>
  );
}
