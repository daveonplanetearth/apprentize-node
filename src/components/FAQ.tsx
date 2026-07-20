import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is Apprentize really free?',
    a: 'Yes — completely. There is no paid tier and no hidden cost. You enter your email, you get alerts, and that is it. We make nothing off your data.',
  },
  {
    q: 'Where does the apprenticeship data come from?',
    a: 'We monitor the same official Find An Apprenticeship vacancy feed operated by the UK government. This covers apprenticeships in England only — we do not currently alert on roles in Scotland, Wales, or Northern Ireland. We do not scrape third-party job boards; only the public, official source.',
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
    q: 'How do I unsubscribe?',
    a: 'Every email includes a one-click unsubscribe link. You can also reply to any alert and ask to be removed. No account to delete, no settings to find.',
  },
];

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border transition-colors ${open ? 'border-ink/30 bg-card' : 'border-line bg-card/60 hover:border-line'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className={`font-display font-bold text-base sm:text-lg transition-colors ${open ? 'text-ink' : 'text-ink'}`}>{q}</span>
        <ChevronDown className={`shrink-0 w-5 h-5 text-ink-soft transition-transform duration-300 ${open ? 'rotate-180 text-safety' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 text-ink-soft leading-relaxed text-[15px]">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28 border-t border-line/60">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-safety">FAQ</p>
          <h2 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <FaqItem
              key={faq.q}
              {...faq}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
