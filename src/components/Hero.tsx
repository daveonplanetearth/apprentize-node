import { Mail, ShieldCheck, Bell } from 'lucide-react';
import EmailSignup from './EmailSignup';
import EmailPreview from './EmailPreview';

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-safety/5 rounded-full blur-[120px] pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-safety/30 bg-safety/10 px-4 py-2 text-sm font-bold uppercase tracking-wide text-safety animate-fade-up">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-safety animate-pulse-ring" />
                <span className="relative rounded-full w-2 h-2 bg-safety" />
              </span>
              Free apprenticeship alerts
            </div>
            {/* <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal animate-fade-up" style={{ animationDelay: '0.02s', opacity: 0 }}>
              <MapPin className="w-4 h-4" /> England only
            </div> */}

            <h1 className="mt-6 font-display font-extrabold text-ink text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
              Get notified the <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-safety">moment</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 8C40 3 160 3 198 8" stroke="#FF5A1F" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span> an apprenticeship opens.
            </h1>

            <p className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              The UK Government Find An Apprenticeship email alert only goes out once a week. Apprentize checks the same official data every day and emails you the moment an apprenticeship in <strong className="text-ink font-semibold">England</strong> opens — filtered by your region.
            </p>

            <div id="signup" className="mt-8 max-w-lg mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.15s', opacity: 0 }}>
              <EmailSignup source="hero" />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-ink-soft animate-fade-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-teal" /> No spam, ever</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="w-4 h-4 text-teal" /> Daily alerts only</span>
              <span className="inline-flex items-center gap-1.5"><Bell className="w-4 h-4 text-teal" /> Cancel anytime</span>
            </div>
          </div>

          {/* visual */}
          <div className="relative mt-8 lg:mt-0 animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
            <EmailPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
