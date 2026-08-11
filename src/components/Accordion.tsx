import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionEntry {
  q: string;
  a: ReactNode;
}

function AccordionItem({ q, a, open, onToggle }: { q: string; a: ReactNode; open: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border transition-colors ${open ? 'border-ink/30 bg-card' : 'border-line bg-card/60 hover:border-line'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display font-bold text-base sm:text-lg text-ink">{q}</span>
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

interface AccordionProps {
  items: AccordionEntry[];
  defaultOpenIndex?: number | null;
}

export default function Accordion({ items, defaultOpenIndex = null }: AccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <AccordionItem
          key={item.q}
          {...item}
          open={openIdx === i}
          onToggle={() => setOpenIdx(openIdx === i ? null : i)}
        />
      ))}
    </div>
  );
}
