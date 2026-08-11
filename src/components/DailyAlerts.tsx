import { Mail, ShieldCheck, Bell } from 'lucide-react';
import EmailSignup from './EmailSignup';

export default function DailyAlerts() {
  return (
    <section id="alerts" className="relative py-20 sm:py-28 border-t border-line/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-safety">Daily email alerts</p>
          <h2 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            Let new roles come to you.
          </h2>
          <p className="mt-4 text-lg text-ink-soft text-pretty">
            Set your region and travel distance. The day a matching apprenticeship opens, we email you a clean, scannable alert with a direct link to apply. Complete the form below to sign up.
          </p>
        </div>

        <div className="mt-14 max-w-xl">
          <div id="signup">
            <EmailSignup source="alerts" />
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-teal" /> No spam, ever</span>
              <span className="inline-flex items-center gap-1.5"><Mail className="w-4 h-4 text-teal" /> Daily alerts only</span>
              <span className="inline-flex items-center gap-1.5"><Bell className="w-4 h-4 text-teal" /> Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
