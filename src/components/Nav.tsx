import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
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
  { label: 'How to apply', href: '/#applying' },
  { label: 'FAQ', href: '/#faq' },
];

const browseLink = { label: 'Search', href: '/#/apprenticeships' };
const preferencesLink = { label: 'Account', href: '/#/preferences' };

interface NavProps {
  isHome?: boolean;
}

export default function Nav({ isHome = false }: NavProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  // On the home page, always show the CTA even if already subscribed — the visitor may be
  // back to sign up again with a different email.
  const hasSessionToken = useHasSessionToken();
  const hideCta = hasSessionToken && !isHome;
  const accountLinks = hasSessionToken ? [browseLink, preferencesLink] : [browseLink];
  const links = [...marketingLinks, ...accountLinks];

  // The scrolled look is toggled as a data attribute straight on the element, not via React
  // state, and the handler is coalesced into one rAF per frame. Re-rendering the whole nav on the
  // first scroll frame was part of a visible stall when scrolling started on mobile.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      header.dataset.scrolled = String(window.scrollY > 12);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // This bar deliberately has no backdrop filter. Creating such a layer on the first
    // scroll frame made the compositor re-rasterise everything under a full-width fixed bar —
    // including the hero's 40rem blurred wash — which stalled the start of the scroll on mobile.
    // An opaque bg-paper reads near-identically over this background. The transition is scoped to
    // the properties that actually change; it was transition-all, which animated that filter too.
    // The border is always present but transparent, so turning it on tints a pixel row instead of
    // shifting the layout. Note: don't name Tailwind utilities in this comment — the scanner reads
    // comments and will re-emit the utility into the stylesheet even though nothing uses it.
    <header
      ref={headerRef}
      data-scrolled="false"
      className="fixed top-0 inset-x-0 z-50 border-b border-transparent bg-transparent transition-[background-color,border-color,box-shadow] duration-300 data-[scrolled=true]:border-line/60 data-[scrolled=true]:bg-paper data-[scrolled=true]:shadow-[0_8px_24px_rgba(76,29,149,0.08)]"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Deliberately not `justify-between`: that distributes free space *between* children, so
            the nav's position depended on whether the CTA was rendered — hiding it (e.g. on
            Preferences) let the nav slide right. The nav is instead left-anchored next to the
            logo, and the trailing CTA/menu button is pushed to the far edge with `ml-auto`, so
            nav position is identical in every state. */}
        <div className="flex items-center gap-3 h-16">
          <a href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-12 h-8 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
              <Logo size={48} />
            </div>
            <span className="font-display font-bold text-xl text-ink tracking-tight">apprentize</span>
          </a>

          {/* `whitespace-nowrap` is load-bearing: without it these links wrap mid-label when the
              row gets tight, and the exact width where that starts shifts with each browser's font
              metrics — so the nav broke in one browser but not another at the same window size.
              The breakpoint is `lg` rather than `md` because the row needs ~940px in its widest
              state (logged in on home: 7 links *and* the CTA); `md` (720px box) guaranteed a wrap.
              That state clears `lg` by only ~35px, which is why the labels here are terse —
              lengthening one, or adding an eighth link, will overflow before it visibly wraps. */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="whitespace-nowrap px-3 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors rounded-full hover:bg-white/70">
                {l.label}
              </a>
            ))}
          </nav>

          {/* This once stayed in the flow as `invisible` to stop the nav shifting when the CTA was
              hidden. That is no longer needed — the left-anchored layout above makes nav position
              independent of this element — and reserving 137px of dead space cost enough width to
              push the widest state back toward the wrap threshold. */}
          {!hideCta && (
            <div className="hidden lg:block ml-auto">
              <a href="/#alerts" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full glossy-button text-white px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98]">
                Get free alerts
              </a>
            </div>
          )}

          <button
            className="lg:hidden ml-auto p-2 -mr-2 text-ink"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line/60 bg-paper">
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
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full glossy-button text-white px-5 py-3 text-base font-semibold"
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
