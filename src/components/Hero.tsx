import { useState, FormEvent } from 'react';
import { MapPin, Search } from 'lucide-react';

export default function Hero() {
  const [postcode, setPostcode] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = postcode.trim();
    if (!trimmed) return;
    window.location.hash = `/apprenticeships?postcode=${encodeURIComponent(trimmed)}`;
  };

  return (
    <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-safety/5 rounded-full blur-[120px] pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-safety/30 bg-safety/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-safety animate-fade-up">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-safety animate-pulse-ring" />
            <span className="relative rounded-full w-2 h-2 bg-safety" />
          </span>
          Free apprenticeship search
        </div>

        <h1 className="mt-6 font-display font-extrabold text-ink text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
          Search <span className="font-semibold bg-[linear-gradient(90deg,#ff0080,#ff8c00,#ffd700,#00d26a,#00bfff,#7c3aed,#ff0080)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[spectrum-shift_4s_linear_infinite]">live</span> <span className="relative whitespace-nowrap">
            <span className="relative z-10 text-safety">apprenticeships</span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden>
              <path d="M2 8C40 3 160 3 198 8" stroke="#FF5A1F" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto text-pretty whitespace-nowrap animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          Apprentize is where you browse every live apprenticeship vacancy near you*
        </p>
        <p className="mt-2 text-sm text-ink-soft animate-fade-up" style={{ animationDelay: '0.12s', opacity: 0 }}>
          <span className="font-semibold text-safety">340+</span> apprenticeships currently live
        </p>
        <p className="mt-1 text-xs text-ink-soft/80 animate-fade-up" style={{ animationDelay: '0.14s', opacity: 0 }}>
          * only apprenticeships in England are currently available, not the whole UK
        </p>

        <form onSubmit={handleSearch} className="mt-8 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <div className="flex flex-col sm:flex-row gap-2 bg-card rounded-2xl border border-line shadow-[0_8px_30px_rgba(22,35,59,0.08)] p-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                placeholder="Enter your post code"
                aria-label="Postcode"
                className="w-full rounded-xl bg-transparent pl-10 pr-4 py-3.5 text-base text-ink placeholder:text-ink-soft/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!postcode.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-safety text-white font-semibold px-6 py-3.5 text-base transition-all hover:bg-safety-deep disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </form>

        <div className="mt-5 animate-fade-up" style={{ animationDelay: '0.18s', opacity: 0 }}>
          <p className="text-sm text-ink-soft">
            Prefer to get a daily email when new roles open?{' '}
            <a href="#alerts" className="font-semibold text-ink underline underline-offset-2 hover:text-safety transition-colors">
              Set up free alerts
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
