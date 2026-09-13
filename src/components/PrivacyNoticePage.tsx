// Keep in step with Apprentize.Api's AppConstants.CurrentPrivacyVersion, which records the
// version each new subscriber signed up under.
const LAST_UPDATED = '13 September 2026';

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
              <p>Browsing apprenticeship listings at <span className="font-mono text-sm">#/apprenticeships</span> doesn't require signing up. Whether or not you're signed up, we keep anonymous statistics about how the site is used:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li>
                  <strong className="text-ink">Anonymous usage statistics</strong> — the searches made (the postcode
                  district only, such as "B15", never the full postcode; the radius; any search words; the areas or
                  courses filtered by; and how many results came back), which vacancies are viewed, and when "Apply
                  now" is clicked. To estimate how many people use the site each day, your IP address and browser
                  details are turned into a code using a random value that changes every day and is then deleted.
                  We never store your IP address or browser details, the code can't be turned back into them, and
                  codes can't be linked from one day to the next. None of this is linked to your account, and no
                  cookies are used.
                </li>
                <li>
                  <strong className="text-ink">Your location</strong> — only if you tap <em>Use my location</em>. Your
                  browser asks your permission first. We use your location once, to find the nearest postcode, and
                  then search with that postcode like any other. We don't store your location or record it in our
                  statistics.
                </li>
              </ul>
              <p>When you sign up for alerts, we collect:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li><strong className="text-ink">Email address</strong> — required, so we can send you alerts and manage your subscription.</li>
                <li><strong className="text-ink">Age band</strong> (16–17 or 18+) — required. We do not accept sign-ups from anyone who tells us they are under 16 (see Section 9).</li>
                <li><strong className="text-ink">Postcode and search radius</strong> (5, 10, 15 or 25 miles) — required, used to match alerts to your area.</li>
                <li>
                  <strong className="text-ink">Your interests</strong> — optional. The apprenticeship areas (for example
                  "Digital") and specific courses you choose, at signup or later in My Preferences. If you choose none,
                  you hear about every apprenticeship in your area.
                </li>
                <li><strong className="text-ink">Consent records</strong> — whether you agreed to our Terms of Service/this notice and to receiving alert emails, and when.</li>
              </ul>
              <p>
                If you later manage your preferences, we also hold a <span className="font-mono text-sm">session token</span> in
                your browser's local storage — see Section 8.
              </p>
            </Section>

            <Section id="how-we-use-it" title="3. How we use your data and our lawful basis">
              <p>
                We use your data to operate the alerts service: matching apprenticeship vacancies against your
                area and interests, sending you alert and account-related emails, and letting you manage or cancel
                your subscription. If you've chosen interests, we use them to decide which vacancies to email you
                about, and to filter the listings you see when you browse while signed in — you can always choose
                to see everything in your area instead.
              </p>
              <p>
                Our lawful basis is your <strong className="text-ink">consent</strong> (UK GDPR Article 6(1)(a)), given
                when you tick the two consent boxes at signup — one for our Terms of Service and this notice, one
                specifically for receiving alert emails, as required by the Privacy and Electronic Communications
                Regulations (PECR). You can withdraw consent at any time (Section 7).
              </p>
              <p>
                <strong className="text-ink">Anonymous statistics.</strong> We count how many subscribers are interested
                in each apprenticeship area, broken down by postcode district (the first half of a postcode, such as
                "B15"). We may share these counts with training providers and employers who want to sponsor
                content on Apprentize, and use them to price that sponsorship. The counts contain no names, email
                addresses, full postcodes or anything else that identifies you, and we don't report any group smaller
                than 10 subscribers, so a count can't be traced back to an individual. Producing these counts relies on
                our <strong className="text-ink">legitimate interests</strong> (UK GDPR Article 6(1)(f)) in funding the
                free service; you can object at any time (Section 10).
              </p>
              <p>
                <strong className="text-ink">Usage statistics</strong> (Section 2) help us understand how Apprentize is
                used and improve it. We may share totals from them with training providers and employers, such as how
                often their vacancies were viewed or how many searches there were in an area. We share totals only,
                and no breakdown by area reports fewer than 10. This also relies on our{' '}
                <strong className="text-ink">legitimate interests</strong> in running and funding the service. If your
                browser sends a Global Privacy Control signal, we don't count it. You can also switch counting off
                for your browser at any time (Section 10).
              </p>
              <p>We do not use your data for automated decision-making or profiling that produces legal or similarly significant effects. We do not sell your data or share it with third parties for their own marketing, we don't show you advertising, and no advertiser or sponsor ever receives your personal data.</p>
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
                <li>
                  <strong className="text-ink">postcodes.io</strong> — finds where a postcode is, and the nearest postcode
                  when you use <em>Use my location</em>. Our server sends it only the postcode or location being looked
                  up, never your IP address, email or anything else that identifies you.
                </li>
                <li><strong className="text-ink">Google Fonts</strong> — this site loads typefaces from Google's servers, which means your browser's IP address is visible to Google when a page loads. Google does not receive your email, postcode, or any other subscriber data from us.</li>
              </ul>
            </Section>

            <Section id="where-stored" title="6. Where your data is stored">
              <p>
                Our hosting and database infrastructure runs in a UK Azure region. Your data is not transferred
                outside the UK by us or our processors listed above, with one exception: postcodes.io runs on
                Cloudflare's global network, so a postcode or location we look up there may be processed outside
                the UK. It never comes with anything that identifies you.
              </p>
            </Section>

            <Section id="retention" title="7. How long we keep your data">
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li><strong className="text-ink">Unconfirmed sign-ups</strong> — deleted automatically 30 days after we last sent you a confirmation link, if it's never used.</li>
                <li><strong className="text-ink">Active subscribers</strong> — kept for as long as your subscription is active.</li>
                <li><strong className="text-ink">After you unsubscribe</strong> — kept for up to 30 days (to prevent accidental re-subscription), then deleted.</li>
                <li><strong className="text-ink">After you delete your account</strong> — removed immediately.</li>
                <li><strong className="text-ink">Your interests</strong> — kept with your account and deleted with it. If you change or clear them, the old choices are removed straight away.</li>
                <li><strong className="text-ink">Anonymous usage statistics</strong> — individual searches, views and clicks are deleted after 13 months. After that we keep only daily totals, which describe no one. Each day's random value is deleted once the day is over.</li>
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
                <li>
                  If you use the link in Section 10 to stop your browser being counted in usage statistics, a
                  marker in your browser's local storage that remembers that choice.
                </li>
              </ul>
              <p>Usage statistics (Section 2) are recorded by our server without cookies or anything else stored in your browser.</p>
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
                <li>
                  Restrict or object to our processing of your data — including being counted in the anonymous
                  statistics described in Sections 2 and 3. To stop your browser being counted in usage statistics,
                  open{' '}
                  <a href="#/privacy?analytics=off" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                    this link
                  </a>{' '}
                  (to undo it,{' '}
                  <a href="#/privacy?analytics=on" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                    this one
                  </a>
                  ). Because those statistics can't be traced back to you, we can't find or remove what was already
                  recorded, but nothing more will be.
                </li>
                <li>Receive your data in a portable format.</li>
                <li>Withdraw consent at any time, without affecting processing carried out before you withdrew it.</li>
              </ul>
              <p>
                You can exercise most of these yourself, immediately, from{' '}
                <a href="#/preferences" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  My Preferences
                </a>{' '}
                — update your postcode, radius and interests, unsubscribe from alerts, or permanently delete your account.
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
