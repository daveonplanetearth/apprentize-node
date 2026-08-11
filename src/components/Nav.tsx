import { useEffect, useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { useHasSessionToken } from '../hooks/usePreferences';

// Every href here is root-absolute (`/#…`, not a bare `#…`) because this nav also renders on the
// details page's shared /apprenticeship/<id> URL, where a fragment-only link would hang the hash
// off that path instead of the site root. From the landing page these stay same-document, so
// anchor scrolling still works without a reload.

// Informational links relevant to every visitor, subscribed or not.
const marketingLinks = [
  { label: 'How it works', href: '/#how' },
  { label: 'Daily alerts', href: '/#alerts' },
  { label: 'What you get', href: '/#what' },
  { label: 'Levels explained', href: '/#levels' },
  { label: 'How to apply', href: '/#applying' },
  { label: 'FAQ', href: '/#faq' },
];

const browseLink = { label: 'Browse Apprenticeships', href: '/#/apprenticeships' };
const preferencesLink = { label: 'My Preferences', href: '/#/preferences' };

interface NavProps {
  isHome?: boolean;
}

export default function Nav({ isHome = false }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // On the home page, always show the CTA even if already subscribed — the visitor may be
  // back to sign up again with a different email.
  const hasSessionToken = useHasSessionToken();
  const hideCta = hasSessionToken && !isHome;
  const accountLinks = hasSessionToken ? [browseLink, preferencesLink] : [browseLink];
  const links = [...marketingLinks, ...accountLinks];

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
          <a href="/" className="flex items-center gap-2.5 group">
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

          {/* Kept in the flex flow (just made invisible) when hidden, so the nav links don't
              shift position depending on whether this CTA is shown. */}
          <div className={`hidden md:block ${hideCta ? 'invisible' : ''}`}>
            <a href="/#alerts" className="inline-flex items-center gap-2 rounded-lg bg-ink text-paper px-5 py-2.5 text-sm font-semibold hover:bg-ink/90 transition-colors active:scale-[0.98]">
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
            {!hideCta && (
              <a
                href="/#alerts"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-ink text-paper px-5 py-3 text-base font-semibold"
              >
                Get free alerts
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
