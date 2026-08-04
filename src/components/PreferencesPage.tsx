import { Settings } from 'lucide-react';

export default function PreferencesPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-teal/8 rounded-full blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-2xl px-5 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink/5 mb-4">
            <Settings className="w-6 h-6 text-ink-soft/60" />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-safety animate-fade-up">Your account</p>
          <h1 className="mt-3 font-display font-extrabold text-ink text-3xl sm:text-4xl lg:text-5xl tracking-tight text-balance animate-fade-up" style={{ animationDelay: '0.05s', opacity: 0 }}>
            Preferences
          </h1>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed text-pretty animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            Manage how and when Apprentize alerts you. This page is coming soon.
          </p>
        </div>
      </section>
    </div>
  );
}
