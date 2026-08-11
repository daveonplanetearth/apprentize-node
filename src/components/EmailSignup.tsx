import { useState, FormEvent } from 'react';
import { ArrowRight, Check, Loader2, AlertCircle, Mail, MapPin } from 'lucide-react';
import { useSubscribe, AgeGroup } from '../hooks/useSubscribe';

interface EmailSignupProps {
  source: string;
  className?: string;
}

const AGE_OPTIONS: { value: AgeGroup; label: string }[] = [
  { value: 'under_16', label: 'Under 16' },
  { value: '16_17', label: '16–17 years old' },
  { value: '18_plus', label: '18 years or later' },
];

// Must match Apprentize.Api's ValidRadii — any other value causes the API to silently
// drop a new signup (it still returns its generic neutral response).
const RADIUS_OPTIONS = [5, 10, 15, 25] as const;
const DEFAULT_RADIUS = 15;

export default function EmailSignup({ source, className = '' }: EmailSignupProps) {
  const { state, message, errorField, subscribe, reset } = useSubscribe();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [ageGroup, setAgeGroup] = useState<AgeGroup | ''>('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAlerts, setAgreeAlerts] = useState(false);
  const [consentTouched, setConsentTouched] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [postcodeTouched, setPostcodeTouched] = useState(false);
  const [ageTouched, setAgeTouched] = useState(false);
  const [radiusMiles, setRadiusMiles] = useState<number>(DEFAULT_RADIUS);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const consentsValid = agreeTerms && agreeAlerts;
  const isUnder16 = ageGroup === 'under_16';
  const postcodeValid = postcode.trim().length > 0;
  const ageGroupValid = ageGroup !== '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setConsentTouched(true);
    setPostcodeTouched(true);
    setAgeTouched(true);
    if (!isValid || !consentsValid || isUnder16 || !postcodeValid || !ageGroupValid || state === 'loading') return;
    await subscribe(email, source, ageGroup || undefined, agreeTerms, agreeAlerts, postcode || undefined, radiusMiles);
  };

  if (state === 'success') {
    const browseHref = postcode.trim()
      ? `#/apprenticeships?postcode=${encodeURIComponent(postcode.trim())}&radius=${radiusMiles}`
      : '#/apprenticeships';

    return (
      <div className={`rounded-2xl bg-teal/5 border border-teal/20 p-5 flex items-start gap-3 animate-slide-in ${className}`}>
        <div className="shrink-0 w-8 h-8 rounded-full bg-teal flex items-center justify-center">
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-ink text-lg leading-tight">You're on the list</p>
          <p className="text-ink-soft text-sm mt-1">{message}</p>
          <a
            href={browseHref}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-soft transition-colors"
          >
            Browse live listings now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  const inputBase = 'w-full rounded-xl border bg-card text-ink placeholder:text-ink-soft/50 transition-all focus:outline-none focus:ring-2';

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-line shadow-[0_8px_30px_rgba(22,35,59,0.08)] p-2 sm:p-3">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-soft/60" />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Enter your email address"
            aria-label="Email address"
            disabled={state === 'loading'}
            className={`${inputBase} pl-11 pr-4 py-4 text-base border-transparent ${
              touched && !isValid ? 'border-safety focus:ring-safety/30' : 'focus:border-ink focus:ring-ink/15'
            } ${state === 'loading' ? 'opacity-60' : ''}`}
          />
        </div>

        <fieldset className="mt-2.5 px-1 pt-1">
          <legend className="text-sm font-semibold text-ink mb-2 px-1">How old are you?</legend>
          <div className="grid sm:grid-cols-3 gap-2">
            {AGE_OPTIONS.map((opt) => {
              const checked = ageGroup === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`group relative flex items-center gap-2.5 rounded-xl border px-3.5 py-3 cursor-pointer transition-all ${
                    checked
                      ? 'border-ink bg-ink/5 ring-2 ring-ink/15'
                      : ageTouched && !ageGroupValid
                        ? 'border-safety'
                        : 'border-line hover:border-ink/40 hover:bg-paper-deep/40'
                  } ${state === 'loading' ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  <input
                    type="radio"
                    name="age-group"
                    value={opt.value}
                    checked={checked}
                    onChange={() => {
                      setAgeGroup(opt.value);
                      setAgeTouched(true);
                    }}
                    disabled={state === 'loading'}
                    className="sr-only"
                  />
                  <span
                    className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                      checked ? 'border-ink' : 'border-line group-hover:border-ink/50'
                    }`}
                  >
                    {checked && <span className="w-2 h-2 rounded-full bg-safety" />}
                  </span>
                  <span className={`text-sm font-medium ${checked ? 'text-ink' : 'text-ink-soft'}`}>{opt.label}</span>
                </label>
              );
            })}
          </div>
          {isUnder16 && (
            <p className="mt-2.5 flex items-start gap-1.5 text-ink-soft text-sm px-1">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              Sorry — we can't sign up under-16s for alerts directly yet. Please ask a parent or guardian, or check back once you turn 16.
            </p>
          )}
          {ageTouched && !ageGroupValid && (
            <p className="mt-2.5 flex items-start gap-1.5 text-safety text-sm font-medium px-1">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              Please tell us your age group.
            </p>
          )}
        </fieldset>

        <div className="mt-3 px-1">
          <div className="grid sm:grid-cols-2 gap-2">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
              <input
                type="text"
                value={postcode}
                onChange={(e) => {
                  setPostcode(e.target.value);
                  if (errorField === 'postcode') reset();
                }}
                onBlur={() => setPostcodeTouched(true)}
                placeholder="Post code"
                aria-label="Postcode"
                aria-required="true"
                disabled={state === 'loading'}
                className={`${inputBase} pl-10 pr-4 py-3 text-sm ${
                  (postcodeTouched && !postcodeValid) || errorField === 'postcode'
                    ? 'border-safety focus:ring-safety/30'
                    : 'border-line focus:border-ink focus:ring-ink/15'
                } ${state === 'loading' ? 'opacity-60' : ''}`}
              />
            </div>
            <div className="relative">
              <select
                value={radiusMiles}
                onChange={(e) => setRadiusMiles(Number(e.target.value))}
                aria-label="Search radius"
                disabled={state === 'loading'}
                className={`${inputBase} appearance-none pl-10 pr-9 py-3 text-sm border-line focus:border-ink focus:ring-ink/15 ${state === 'loading' ? 'opacity-60' : ''}`}
              >
                {RADIUS_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r} Miles</option>
                ))}
              </select>
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft/60 pointer-events-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8l4 4 4-4" /></svg>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink-soft px-1">
            You can enter a full postcode or just the first part (e.g. "SW1A") — a full post code gives more accurate matches.
          </p>
        </div>

        <div className="mt-3 space-y-2">
          {[
            {
              checked: agreeTerms,
              set: setAgreeTerms,
              label: <>I agree to the <a href="#/terms" className="font-semibold text-ink underline underline-offset-2 hover:text-safety">Terms of Service</a> and <a href="#/privacy" className="font-semibold text-ink underline underline-offset-2 hover:text-safety">Privacy Notice</a>.</>,
              key: 'terms',
            },
            {
              checked: agreeAlerts,
              set: setAgreeAlerts,
              label: <>I consent to receiving apprenticeship alert emails.</>,
              key: 'alerts',
            },
          ].map((box) => {
            const invalid = consentTouched && !box.checked;
            return (
              <label
                key={box.key}
                className={`group flex items-start gap-2.5 rounded-xl border px-3.5 py-3 cursor-pointer transition-all ${
                  box.checked ? 'border-ink/40 bg-ink/[0.03]' : 'border-line hover:border-ink/40 hover:bg-paper-deep/40'
                } ${invalid ? '!border-safety bg-safety/5' : ''} ${state === 'loading' ? 'opacity-60 pointer-events-none' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={box.checked}
                  onChange={(e) => box.set(e.target.checked)}
                  disabled={state === 'loading'}
                  className="sr-only"
                />
                <span
                  className={`shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    box.checked ? 'border-ink bg-ink' : 'border-line group-hover:border-ink/50'
                  } ${invalid ? '!border-safety' : ''}`}
                >
                  {box.checked && <Check className="w-3.5 h-3.5 text-safety" strokeWidth={3} />}
                </span>
                <span className="text-sm text-ink-soft leading-snug">{box.label}</span>
              </label>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={
            state === 'loading' ||
            (touched && !isValid) ||
            (consentTouched && !consentsValid) ||
            (postcodeTouched && !postcodeValid) ||
            (ageTouched && !ageGroupValid) ||
            isUnder16
          }
          className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-safety text-white font-semibold px-7 py-4 text-base transition-all hover:bg-safety-deep disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {state === 'loading' ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Subscribing…</>
          ) : (
            <>Get free alerts <ArrowRight className="w-5 h-5" /></>
          )}
        </button>
      </form>
      {state === 'error' && errorField !== 'postcode' && (
        <p className="mt-3 flex items-center gap-1.5 text-safety text-sm font-medium pl-2">
          <AlertCircle className="w-4 h-4" /> {message}
        </p>
      )}
      {touched && !isValid && state !== 'error' && (
        <p className="mt-2.5 flex items-center gap-1.5 text-ink-soft text-sm pl-2">
          <AlertCircle className="w-4 h-4" /> Please enter a valid email address.
        </p>
      )}
      {consentTouched && !consentsValid && (
        <p className="mt-2.5 flex items-center gap-1.5 text-safety text-sm font-medium pl-2">
          <AlertCircle className="w-4 h-4" /> Please tick both boxes to continue.
        </p>
      )}
      {postcodeTouched && !postcodeValid && (
        <p className="mt-2.5 flex items-center gap-1.5 text-safety text-sm font-medium pl-2">
          <AlertCircle className="w-4 h-4" /> Please enter your post code.
        </p>
      )}
      {errorField === 'postcode' && (
        <p className="mt-2.5 flex items-center gap-1.5 text-safety text-sm font-medium pl-2">
          <AlertCircle className="w-4 h-4" /> {message}
        </p>
      )}
    </div>
  );
}
