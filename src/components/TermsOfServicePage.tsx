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

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b pointer-events-none" aria-hidden />
        <div className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-teal/8 rounded-full blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-3xl px-5 sm:px-6">
          <h1 className="font-display font-extrabold text-ink text-3xl sm:text-4xl tracking-tight text-balance">
            Terms of Service
          </h1>
          <p className="mt-3 text-ink-soft">Last updated: {LAST_UPDATED}</p>

          <p className="mt-6 text-lg text-ink-soft leading-relaxed text-pretty">
            These terms explain what you're agreeing to when you use Apprentize. Please read them alongside our{' '}
            <a href="#/privacy" className="font-semibold text-teal hover:text-teal-soft transition-colors">
              Privacy Notice
            </a>
            , which covers how we handle your personal data.
          </p>

          <div className="mt-10 rounded-2xl border border-line bg-card p-5 sm:p-6 divide-y divide-line/70 [&>section]:pb-0">
            <Section id="who-we-are" title="1. Who we are">
              <p>
                Apprentize is owned and operated by <strong className="text-ink">Experienced Machines Limited</strong>{' '}
                ("Apprentize", "we", "us", "our"), a company registered in England and Wales with company number{' '}
                <strong className="text-ink">16995407</strong>, registered office at 3rd Floor, 86–90 Paul Street,
                London, England, United Kingdom, EC2A 4NE.
              </p>
              <p>
                Apprentize is an independent service and is not affiliated with the UK government or the Find An
                Apprenticeship service.
              </p>
            </Section>

            <Section id="acceptance" title="2. Acceptance of these terms">
              <p>
                By ticking the "I agree to the Terms of Service and Privacy Notice" box when you sign up, or by
                otherwise using Apprentize, you agree to be bound by these terms. If you don't agree to them, please
                don't use the service.
              </p>
            </Section>

            <Section id="using-apprentize" title="3. Using Apprentize">
              <p>
                Apprentize is a free service that monitors the UK government's official Find An Apprenticeship
                vacancy feed and, if you subscribe, emails you when a vacancy matching your criteria appears. You
                can also browse live listings directly at any time without signing up.
              </p>
              <p>There is no paid tier, and we don't charge for any part of the service described in these terms.</p>
            </Section>

            <Section id="eligibility" title="4. Eligibility">
              <p>
                Apprentize is intended for people aged 16 and over. By signing up, you confirm that you are at
                least 16. We ask for your age band at signup and don't accept sign-ups from anyone who selects
                "Under 16" — this is a self-declared answer, and we don't independently verify age.
              </p>
            </Section>

            <Section id="your-subscription" title="5. Your subscription">
              <p>
                When you sign up, we send a confirmation email — your subscription only becomes active once you
                click the link inside it. You can update your postcode and search radius, unsubscribe, or
                permanently delete your account at any time from{' '}
                <a href="#/preferences" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  My Preferences
                </a>
                .
              </p>
            </Section>

            <Section id="acceptable-use" title="6. Acceptable use">
              <p>When using Apprentize, you agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-teal">
                <li>Provide false information when signing up, including misrepresenting your age.</li>
                <li>Scrape, or query the listings search or alert system in an automated or bulk manner.</li>
                <li>Attempt to access another visitor's preferences, session token, or account data.</li>
                <li>Reverse-engineer, interfere with, or disrupt the service.</li>
                <li>Use the service for any unlawful purpose.</li>
              </ul>
            </Section>

            <Section id="listings-and-applications" title="7. Apprenticeship listings and applications">
              <p>
                The apprenticeship listings shown on Apprentize are sourced from the UK government's official
                vacancy feed and provided "as is." We don't guarantee that listings are accurate, complete, or
                up to date, or that a vacancy will still be open by the time you view or apply to it.
              </p>
              <p>
                Applying to a listed apprenticeship happens on the employer's or the source service's own
                platform — Apprentize is not a party to that application or any resulting hiring decision, and we
                aren't responsible for the conduct, content, or outcomes of third-party sites you're directed to.
              </p>
            </Section>

            <Section id="intellectual-property" title="8. Intellectual property">
              <p>
                The Apprentize name, branding, design, and website code are owned by Experienced Machines Limited.
                "Apprentize™" is a trademark of Experienced Machines Limited, pending registration in the UK. You
                may not copy, reproduce, or reuse these without our permission.
              </p>
              <p>
                The underlying apprenticeship vacancy data is sourced from the UK government's Find An
                Apprenticeship service and remains subject to that service's own terms — we don't claim ownership
                over it, only republish it.
              </p>
            </Section>

            <Section id="liability" title="9. Limitation of liability">
              <p>
                Apprentize is provided free of charge and "as is," without warranty of any kind, including as to
                accuracy, completeness, or availability. To the fullest extent permitted by law, we exclude all
                liability for any loss arising from your use of the service, including indirect or consequential
                loss such as a missed job opportunity.
              </p>
              <p>
                Nothing in these terms excludes or limits our liability for death or personal injury caused by our
                negligence, for fraud, or for anything else that can't lawfully be excluded or limited.
              </p>
            </Section>

            <Section id="suspension-termination" title="10. Suspension and termination">
              <p>
                We may suspend or terminate your access to Apprentize at our discretion, with or without notice, if
                we believe you've breached these terms or misused the service. You can stop using Apprentize, or
                unsubscribe and delete your account, at any time via{' '}
                <a href="#/preferences" className="font-semibold text-teal hover:text-teal-soft transition-colors">
                  My Preferences
                </a>
                .
              </p>
            </Section>

            <Section id="changes" title="11. Changes to these terms">
              <p>
                We may update these terms from time to time, for example if we change how the service works or to
                reflect legal requirements. We'll update the "Last updated" date above when we do.
              </p>
            </Section>

            <Section id="governing-law" title="12. Governing law and jurisdiction">
              <p>
                These terms are governed by the laws of England and Wales, and any dispute arising from them is
                subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </Section>

            <Section id="contact-us" title="13. Contact us">
              <p className="text-ink">
                Experienced Machines Limited
                <br />
                Company number 16995407
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
