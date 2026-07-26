import { useEffect, useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';

const links = [
  { label: 'How it works', href: '#how' },
  { label: 'What you get', href: '#what' },
  { label: 'Browse', href: '#/subscribers' },
  { label: 'FAQ', href: '#faq' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-paper/85 backdrop-blur-md border-b border-line/60' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-ink flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
              <Zap className="w-5 h-5 text-safety" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-xl text-ink tracking-tight">apprentize</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors rounded-lg hover:bg-ink/5">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a href="#signup" className="inline-flex items-center gap-2 rounded-lg bg-ink text-paper px-5 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors active:scale-[0.98]">
              Get free alerts
            </a>
          </div>

          <button
            className="md:hidden p-2 -mr-2 text-ink"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line/60 bg-paper">
          <div className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-base font-medium text-ink-soft hover:text-ink hover:bg-ink/5 rounded-lg transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#signup"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-paper px-5 py-3 text-base font-semibold"
            >
              Get free alerts
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
