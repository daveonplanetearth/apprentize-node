import { useState, useEffect, FormEvent } from 'react';
import { Settings, MapPin, Loader2, AlertCircle, Check, BellOff, Trash2, LogOut, Laptop } from 'lucide-react';
import { usePreferences } from '../hooks/usePreferences';

const RADIUS_OPTIONS = [5, 10, 15, 25] as const;

interface PreferencesPageProps {
  manageToken?: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';
type View = 'prefs' | 'unsubscribed';

export default function PreferencesPage({ manageToken }: PreferencesPageProps) {
  const { state, postcode, searchRadiusMiles, save, unsubscribe, deleteAccount, logout, logoutAll } =
    usePreferences(manageToken);

  const [view, setView] = useState<View>('prefs');
  const [postcodeInput, setPostcodeInput] = useState('');
  const [radiusInput, setRadiusInput] = useState<number>(15);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [postcodeError, setPostcodeError] = useState<string | null>(null);

  const [unsubscribeBusy, setUnsubscribeBusy] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteConfirmPending, setDeleteConfirmPending] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutAllBusy, setLogoutAllBusy] = useState(false);

  // Redirect home the moment the token turns out to be missing, invalid, or expired.
  useEffect(() => {
    if (state === 'unauthorized') {
      window.location.hash = '';
    }
  }, [state]);

  // Seed the editable fields once the real preferences have loaded.
  useEffect(() => {
    if (state === 'ready') {
      setPostcodeInput(postcode);
      setRadiusInput(searchRadiusMiles);
    }
  }, [state, postcode, searchRadiusMiles]);

  useEffect(() => {
    if (saveState !== 'saved') return;
    const t = setTimeout(() => setSaveState('idle'), 4000);
    return () => clearTimeout(t);
  }, [saveState]);

  useEffect(() => {
    if (!deleteConfirmPending) return;
    const t = setTimeout(() => setDeleteConfirmPending(false), 5000);
    return () => clearTimeout(t);
  }, [deleteConfirmPending]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setPostcodeError(null);
    setSaveState('saving');

    const result = await save(postcodeInput.trim(), radiusInput);

    if (result.ok) {
      setSaveState('saved');
    } else {
      setSaveState('error');
      setPostcodeError(result.message ?? 'Something went wrong. Please try again.');
    }
  };

  const handleUnsubscribe = async () => {
    setUnsubscribeBusy(true);
    const ok = await unsubscribe();
    if (ok) {
      setView('unsubscribed');
    } else {
      setUnsubscribeBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmPending) {
      setDeleteConfirmPending(true);
      return;
    }
    setDeleteConfirmPending(false);
    setDeleteBusy(true);
    const ok = await deleteAccount();
    if (ok) {
      window.location.hash = '';
    } else {
      setDeleteBusy(false);
    }
  };

  const handleLogout = async () => {
    setLogoutBusy(true);
    await logout();
    window.location.hash = '';
  };

  const handleLogoutAll = async () => {
    setLogoutAllBusy(true);
    await logoutAll();
    window.location.hash = '';
  };

  const inputBase = 'w-full rounded-xl border border-line bg-paper text-ink placeholder:text-ink-soft/50 transition-all focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/15';

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
          {view === 'prefs' && (
            <p className="mt-4 text-lg text-ink-soft leading-relaxed text-pretty animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              Manage how and when Apprentize alerts you.
            </p>
          )}
        </div>

        <div className="relative mx-auto max-w-2xl px-5 sm:px-6 mt-8">
          {(state === 'loading' || state === 'unauthorized') && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-ink-soft/60 animate-spin" />
            </div>
          )}

          {state === 'ready' && view === 'unsubscribed' && (
            <div className="rounded-2xl bg-card border border-line shadow-[0_8px_30px_rgba(22,35,59,0.08)] p-6 sm:p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal/10 mb-4">
                <Check className="w-6 h-6 text-teal" strokeWidth={3} />
              </div>
              <p className="font-display font-bold text-ink text-xl">You've been unsubscribed</p>
              <p className="text-ink-soft text-sm mt-2">
                You'll no longer receive Apprentize alerts. If you change your mind,{' '}
                <a href="#/signup" className="font-semibold text-ink underline underline-offset-2 hover:text-safety">
                  sign up again
                </a>.
              </p>
            </div>
          )}

          {state === 'ready' && view === 'prefs' && (
            <div className="space-y-6">
              <p className="text-center -mt-2">
                <a href="#/apprenticeships" className="text-sm font-semibold text-teal hover:text-teal-soft transition-colors">
                  Browse apprenticeships
                </a>
              </p>

              <form onSubmit={handleSave} className="bg-card rounded-2xl border border-line shadow-[0_8px_30px_rgba(22,35,59,0.08)] p-5 sm:p-6">
                <fieldset>
                  <legend className="text-sm font-semibold text-ink mb-3">Alert location</legend>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="postcode" className="block text-xs font-semibold text-ink-soft mb-1.5">Postcode</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
                        <input
                          id="postcode"
                          type="text"
                          autoComplete="postal-code"
                          maxLength={8}
                          value={postcodeInput}
                          onChange={(e) => setPostcodeInput(e.target.value)}
                          placeholder="e.g. SW1A 1AA or SW1A"
                          disabled={saveState === 'saving'}
                          className={`${inputBase} pl-10 pr-4 py-3 text-sm ${saveState === 'saving' ? 'opacity-60' : ''}`}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-ink-soft">
                        You can enter a full postcode or just the first part (e.g. "SW1A") — a full postcode gives more accurate matches.
                      </p>
                      {postcodeError && (
                        <p role="alert" className="mt-2 flex items-center gap-1.5 text-safety text-sm font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0" /> {postcodeError}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="radius" className="block text-xs font-semibold text-ink-soft mb-1.5">Search radius</label>
                      <select
                        id="radius"
                        value={radiusInput}
                        onChange={(e) => setRadiusInput(Number(e.target.value))}
                        disabled={saveState === 'saving'}
                        className={`${inputBase} appearance-none px-4 py-3 text-sm ${saveState === 'saving' ? 'opacity-60' : ''}`}
                      >
                        {RADIUS_OPTIONS.map((r) => (
                          <option key={r} value={r}>{r} miles</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saveState === 'saving' || !postcodeInput.trim()}
                    className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-safety text-white font-semibold px-6 py-3 text-sm transition-all hover:bg-safety-deep disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {saveState === 'saving' ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    ) : (
                      'Save preferences'
                    )}
                  </button>
                  {saveState === 'saved' && (
                    <p role="status" className="mt-3 flex items-center gap-1.5 text-teal text-sm font-semibold">
                      <Check className="w-4 h-4" strokeWidth={3} /> Preferences saved
                    </p>
                  )}
                </fieldset>
              </form>

              <div className="bg-card rounded-2xl border border-line shadow-[0_8px_30px_rgba(22,35,59,0.08)] p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-ink mb-4">Manage your account</h2>

                <div className="space-y-3">
                  {[
                    {
                      key: 'unsubscribe',
                      icon: BellOff,
                      label: 'Unsubscribe',
                      description: 'Stop receiving alerts. You can re-subscribe at any time.',
                      onClick: handleUnsubscribe,
                      busy: unsubscribeBusy,
                    },
                    {
                      key: 'delete',
                      icon: Trash2,
                      label: deleteConfirmPending ? 'Are you sure? Click again to confirm.' : 'Delete my data',
                      description: 'Permanently remove all your data from Apprentize.',
                      onClick: handleDelete,
                      busy: deleteBusy,
                      danger: true,
                    },
                    {
                      key: 'logout',
                      icon: LogOut,
                      label: 'Sign out of this device',
                      description: 'End your session on this browser. Other signed-in devices are unaffected.',
                      onClick: handleLogout,
                      busy: logoutBusy,
                    },
                    {
                      key: 'logout-all',
                      icon: Laptop,
                      label: 'Sign out of all devices',
                      description: 'End every signed-in session, including this one.',
                      onClick: handleLogoutAll,
                      busy: logoutAllBusy,
                    },
                  ].map((action) => (
                    <div key={action.key} className="flex items-start justify-between gap-4 rounded-xl border border-line px-4 py-3.5">
                      <div className="flex items-start gap-3 min-w-0">
                        <action.icon className={`w-4 h-4 shrink-0 mt-0.5 ${action.danger ? 'text-safety' : 'text-ink-soft/60'}`} />
                        <p className="text-sm text-ink-soft leading-snug">{action.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={action.onClick}
                        disabled={action.busy}
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          action.danger
                            ? 'bg-safety/10 text-safety hover:bg-safety hover:text-white'
                            : 'bg-ink/5 text-ink hover:bg-ink hover:text-paper'
                        }`}
                      >
                        {action.busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {action.label}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
