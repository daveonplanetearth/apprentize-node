import { useState, FormEvent } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { useSubscribe } from '../hooks/useSubscribe';

export default function LinkExpiredPage() {
  const { subscribe } = useSubscribe();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Neutral like link-expired.js: fire the resend and always land on check-inbox, regardless
    // of outcome, so this never reveals whether an address is registered.
    await subscribe(email.trim(), undefined, undefined, false, false);
    window.location.hash = '/check-inbox';
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-teal/8 rounded-full blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-md px-5 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink/5 mb-4">
            <Clock className="w-6 h-6 text-ink-soft/60" />
          </div>
          <h1 className="font-display font-extrabold text-ink text-3xl sm:text-4xl tracking-tight text-balance">
            This link has expired
          </h1>
          <p className="mt-4 text-lg text-ink-soft leading-relaxed text-pretty">
            Confirmation links are valid for 30 minutes and can only be used once.
          </p>
          <p className="mt-2 text-ink-soft">Enter your email address below and we'll send you a new one.</p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 bg-card rounded-2xl border border-line shadow-[0_8px_30px_rgba(22,35,59,0.08)] p-5 sm:p-6 text-left"
          >
            <label htmlFor="email" className="block text-xs font-semibold text-ink-soft mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
              className="w-full rounded-xl border border-line bg-paper text-ink placeholder:text-ink-soft/50 transition-all focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15 px-4 py-3 text-sm disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !email.trim()}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-safety text-white font-semibold px-6 py-3 text-sm transition-all hover:bg-safety-deep disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                </>
              ) : (
                'Send a new link'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
