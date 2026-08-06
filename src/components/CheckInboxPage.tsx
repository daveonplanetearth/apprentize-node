import { Mail } from 'lucide-react';

export default function CheckInboxPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-teal/8 rounded-full blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-lg px-5 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink/5 mb-4">
            <Mail className="w-6 h-6 text-ink-soft/60" />
          </div>
          <h1 className="font-display font-extrabold text-ink text-3xl sm:text-4xl tracking-tight text-balance">
            Check your inbox
          </h1>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed text-pretty">
            If you don't already have an active subscription, we've sent you an email to confirm your address. It
            may take a minute to arrive.
          </p>
          <p className="mt-2 text-ink-soft">Don't see it? Check your spam folder.</p>

          <p className="mt-8">
            <a href="#" className="text-sm font-semibold text-teal hover:text-teal-soft transition-colors">
              Back
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
