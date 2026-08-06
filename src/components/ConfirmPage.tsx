import { useEffect, useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { useAccept } from '../hooks/useAccept';
import { getStoredSessionToken, setStoredSessionToken } from '../hooks/usePreferences';

interface ConfirmPageProps {
  token?: string;
}

export default function ConfirmPage({ token }: ConfirmPageProps) {
  const { state, accept } = useAccept();
  const [ready, setReady] = useState(false);

  // Mirrors confirm.js: bounce away immediately (no flash of the button) if a session is
  // already active, or if the link is missing its token altogether.
  useEffect(() => {
    if (getStoredSessionToken()) {
      window.location.hash = '/apprenticeships';
      return;
    }
    if (!token) {
      window.location.hash = '/link-expired';
      return;
    }
    setReady(true);
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    const result = await accept(token);

    if (!result) {
      window.location.hash = '/link-expired';
      return;
    }

    setStoredSessionToken(result.sessionToken);

    // The API's redirectUrl can point at the .NET app's session-based results page, which this
    // app doesn't have — send those subscribers to the closest equivalent instead, which does
    // its own best-effort session-aware prefill.
    if (result.redirectUrl.endsWith('/available-apprenticeships')) {
      window.location.hash = '/apprenticeships';
      return;
    }

    window.location.href = result.redirectUrl;
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-teal/8 rounded-full blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-lg px-5 sm:px-6 text-center">
          {!ready ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-ink-soft/60 animate-spin" />
            </div>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ink/5 mb-4">
                <Mail className="w-6 h-6 text-ink-soft/60" />
              </div>
              <h1 className="font-display font-extrabold text-ink text-3xl sm:text-4xl tracking-tight text-balance">
                Confirm your email
              </h1>
              <p className="mt-4 text-lg text-ink-soft leading-relaxed text-pretty">
                Click below to confirm your Apprentize alerts subscription and see matching apprenticeships.
              </p>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={state === 'loading'}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-safety text-white font-semibold px-6 py-3.5 text-sm transition-all hover:bg-safety-deep disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {state === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Confirming…
                  </>
                ) : (
                  'Confirm my email'
                )}
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
