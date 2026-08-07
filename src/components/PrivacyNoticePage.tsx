const LAST_UPDATED = '7 August 2026';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 pt-10 first:pt-0">
      <h2 className="font-display font-bold text-ink text-xl sm:text-2xl tracking-tight">{title}</h2>
      <div className="mt-3 space-y-3 text-ink-soft leading-relaxed text-pretty">{children}</div>
    </section>
  );
}

export default function PrivacyNoticePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-teal/8 rounded-full blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-3xl px-5 sm:px-6">
          <h1 className="font-display font-extrabold text-ink text-3xl sm:text-4xl tracking-tight text-balance">
            Privacy Notice
          </h1>
          <p className="mt-3 text-ink-soft">Last updated: {LAST_UPDATED}</p>

          <p className="mt-6 text-lg text-ink-soft leading-relaxed text-pretty">
            This notice explains what personal data Apprentize collects when you sign up for apprenticeship
            alerts or browse listings, why we collect it, and the choices and rights you have over it.
          </p>

          <div className="mt-10 rounded-2xl border border-line bg-card p-5 sm:p-6 divide-y divide-line/70 [&>section]:pb-0">
            <Section id="who-we-are" title="1. Who we are">
              <p>
                Apprentize is owned and operated by <strong className="text-ink">Experienced Machines Limited</strong>{' '}
                ("Apprentize", "we", "us", "our"), registered office at 3rd Floor, 86–90 Paul Street, London,
                England, United Kingdom, EC2A 4NE.
              </p>
              <p>
                We are registered as a data controller with the UK Information Commissioner's Office (ICO),
                registration reference <strong className="text-ink">ZC169722</strong>.
              </p>
              <p>
                We have not appointed a statutory Data Protection Officer — data protection queries and requests
                are handled directly by our team at{' '}
                <a href="mailto:privacy@experiencedmachines.com" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  privacy@experiencedmachines.com
                </a>
                .
              </p>
              <p>
                Apprentize is an independent service and is not affiliated with the UK government or the Find An
                Apprenticeship service. We do not share your data with either.
              </p>
            </Section>

            <Section id="what-we-collect" title="2. What personal data we collect">
              <p>Browsing apprenticeship listings at <span className="font-mono text-sm">#/apprenticeships</span> doesn't require signing up — any postcode you type in there is used only to run that search and isn't stored unless you also subscribe.</p>
              <p>When you sign up for alerts, we collect:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li><strong className="text-ink">Email address</strong> — required, so we can send you alerts and manage your subscription.</li>
                <li><strong className="text-ink">Age band</strong> (16–17 or 18+) — required. We do not accept sign-ups from anyone who tells us they are under 16 (see Section 9).</li>
                <li><strong className="text-ink">Postcode and search radius</strong> (5, 10, 15 or 25 miles) — optional, used to match alerts to your area.</li>
                <li><strong className="text-ink">Signup source</strong> — a label recording which part of the page you signed up from, for our own internal purposes.</li>
                <li><strong className="text-ink">Consent records</strong> — whether you agreed to our Terms of Service/this notice and to receiving alert emails, and when.</li>
              </ul>
              <p>
                If you later manage your preferences, we also hold a <span className="font-mono text-sm">session token</span> in
                your browser's local storage — see Section 8.
              </p>
            </Section>

            <Section id="how-we-use-it" title="3. How we use your data and our lawful basis">
              <p>
                We use your data solely to operate the alerts service: matching apprenticeship vacancies against
                your criteria, sending you alert and account-related emails, and letting you manage or cancel your
                subscription.
              </p>
              <p>
                Our lawful basis is your <strong className="text-ink">consent</strong> (UK GDPR Article 6(1)(a)), given
                when you tick the two consent boxes at signup — one for our Terms of Service and this notice, one
                specifically for receiving alert emails, as required by the Privacy and Electronic Communications
                Regulations (PECR). You can withdraw consent at any time (Section 7).
              </p>
              <p>We do not use your data for automated decision-making or profiling that produces legal or similarly significant effects, and we do not sell your data or share it with third parties for their own marketing.</p>
            </Section>

            <Section id="confirming" title="4. Confirming your subscription">
              <p>
                We use a double opt-in process: after you sign up, we email you a confirmation link. Alerts only
                start once you click it. This protects against someone signing up an email address that isn't
                theirs, and gives you a clear record of when you consented.
              </p>
              <p>Confirmation links expire after 30 minutes; you can request a new one if yours has expired.</p>
            </Section>

            <Section id="who-we-share-with" title="5. Who we share your data with">
              <p>We use a small number of service providers (data processors) to run Apprentize. They only process your data on our instructions, to provide their service to us:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li><strong className="text-ink">Microsoft Azure</strong> — hosts our application and database.</li>
                <li><strong className="text-ink">Azure Communication Services</strong> — sends confirmation and alert emails on our behalf.</li>
                <li><strong className="text-ink">Google Fonts</strong> — this site loads typefaces from Google's servers, which means your browser's IP address is visible to Google when a page loads. Google does not receive your email, postcode, or any other subscriber data from us.</li>
              </ul>
            </Section>

            <Section id="where-stored" title="6. Where your data is stored">
              <p>
                Our hosting and database infrastructure runs in a UK Azure region. Your data is not transferred
                outside the UK by us or our processors listed above.
              </p>
            </Section>

            <Section id="retention" title="7. How long we keep your data">
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li><strong className="text-ink">Unconfirmed sign-ups</strong> — deleted automatically after 30 days if the confirmation link is never used.</li>
                <li><strong className="text-ink">Active subscribers</strong> — kept for as long as your subscription is active.</li>
                <li><strong className="text-ink">After you unsubscribe</strong> — kept for up to 30 days (to prevent accidental re-subscription), then deleted.</li>
                <li><strong className="text-ink">After you delete your account</strong> — removed immediately.</li>
              </ul>
              <p>
                You can unsubscribe or permanently delete your account at any time from{' '}
                <a href="#/preferences" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  My Preferences
                </a>
                .
              </p>
            </Section>

            <Section id="cookies" title="8. Cookies and similar technologies">
              <p>
                Apprentize doesn't use cookies for advertising or analytics, and we don't run a cookie-consent
                banner because we don't need one — we only use what's known as "strictly necessary" storage:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li>
                  A <span className="font-mono text-sm">session token</span> saved in your browser's local storage
                  once you confirm your subscription or access your preferences via an emailed link. It's used to
                  keep you signed in to manage your preferences and is never used to track you elsewhere. It's
                  removed when you log out, unsubscribe, or delete your account.
                </li>
                <li>The Google Fonts requests described in Section 5.</li>
              </ul>
            </Section>

            <Section id="under-16" title="9. Age requirement">
              <p>
                Apprentize is intended for people aged 16 and over. We ask for your age band at signup, and we
                don't accept sign-ups from anyone who selects "Under 16." This is a self-declared answer — we
                don't independently verify age — and there is no parental-consent process, because under-16s
                cannot sign up in the first place.
              </p>
            </Section>

            <Section id="your-rights" title="10. Your rights">
              <p>Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li>Access the personal data we hold about you.</li>
                <li>Have inaccurate data corrected.</li>
                <li>Have your data erased.</li>
                <li>Restrict or object to our processing of your data.</li>
                <li>Receive your data in a portable format.</li>
                <li>Withdraw consent at any time, without affecting processing carried out before you withdrew it.</li>
              </ul>
              <p>
                You can exercise most of these yourself, immediately, from{' '}
                <a href="#/preferences" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  My Preferences
                </a>{' '}
                — update your postcode and radius, unsubscribe from alerts, or permanently delete your account.
                For anything else, or if you no longer have access to your preferences link, email{' '}
                <a href="mailto:privacy@experiencedmachines.com" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  privacy@experiencedmachines.com
                </a>
                .
              </p>
            </Section>

            <Section id="complaints" title="11. How to complain">
              <p>
                We'd like the chance to put things right, so please contact us first at{' '}
                <a href="mailto:privacy@experiencedmachines.com" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  privacy@experiencedmachines.com
                </a>
                .
              </p>
              <p>You also have the right to complain to the UK's data protection regulator at any time:</p>
              <p className="text-ink">
                Information Commissioner's Office
                <br />
                Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF
                <br />
                Helpline: 0303 123 1113
                <br />
                <a href="https://ico.org.uk" target="_blank" rel="noreferrer" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  ico.org.uk
                </a>
              </p>
            </Section>

            <Section id="changes" title="12. Changes to this notice">
              <p>
                We may update this notice from time to time, for example if we change how the service works or
                to reflect legal requirements. We'll update the "Last updated" date above when we do.
              </p>
            </Section>

            <Section id="contact-us" title="13. Contact us">
              <p className="text-ink">
                Experienced Machines Limited
                <br />
                3rd Floor, 86–90 Paul Street, London, England, United Kingdom, EC2A 4NE
                <br />
                <a href="mailto:privacy@experiencedmachines.com" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  privacy@experiencedmachines.com
                </a>
              </p>
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
}
