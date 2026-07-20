import { Zap, Mail, ShieldCheck, Bell } from 'lucide-react';
import EmailSignup from './EmailSignup';

export default function Footer() {
  return (
    <footer className="relative border-t border-line/60">
      {/* final CTA */}
      <div className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-60 pointer-events-none" aria-hidden />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-safety/8 rounded-full blur-[100px] pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-2xl px-5 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-semibold text-ink-soft">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-safety animate-pulse-ring" />
              <span className="relative rounded-full w-2 h-2 bg-safety" />
            </span>
            Start in under a minute
          </div>

          <h2 className="mt-6 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance">
            Don't miss the next one.
          </h2>
          <p className="mt-4 text-lg text-ink-soft text-pretty">
            Enter your email and Apprentize will notify you the day a matching apprenticeship in England opens — not six days later.
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <EmailSignup source="footer" variant="compact" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-teal" /> No spam</span>
            <span className="inline-flex items-center gap-1.5"><Mail className="w-4 h-4 text-teal" /> Daily alerts only</span>
            <span className="inline-flex items-center gap-1.5"><Bell className="w-4 h-4 text-teal" /> Cancel anytime</span>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-line/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center">
              <Zap className="w-4 h-4 text-safety" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg text-ink tracking-tight">apprentize</span>
          </div>

          <p className="text-sm text-ink-soft text-center sm:text-right">
            Apprentize is an independent service and is not affiliated with the UK government or the Find An Apprenticeship service.
          </p>
        </div>
      </div>
    </footer>
  );
}
