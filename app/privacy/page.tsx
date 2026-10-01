import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/sanity/lib/queries'
import LegalPage, { type LegalSection } from '@/components/LegalPage'

const UPDATED = '1 October 2026'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    fallbackSeo: settings.seo.default,
    title: 'Privacy Policy',
    description: 'How Nefertiti Retreats collects, uses and protects your personal information when you visit our website or contact us.',
    path: '/privacy',
  })
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings()
  const email = settings.contactEmail

  const sections: LegalSection[] = [
    {
      id: 'who-we-are',
      heading: 'Who is responsible for your data',
      body: (
        <p>
          <strong>Nefertiti Retreats</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), based between
          Egypt and Italy, is responsible for the personal information collected through this website. For any privacy
          question or request, contact us at <a href={`mailto:${email}`}>{email}</a>.
        </p>
      ),
    },
    {
      id: 'what-we-collect',
      heading: 'What we collect',
      body: (
        <>
          <p><strong>Information you give us.</strong> When you send an enquiry through our contact form we collect:</p>
          <ul>
            <li>your name and email address;</li>
            <li>your phone / WhatsApp number (optional);</li>
            <li>the type of retreat you are interested in and, if relevant, the specific retreat you are enquiring about;</li>
            <li>your message and the date and time it was sent.</li>
          </ul>
          <p>
            If you contact us by email or WhatsApp, we receive your name, contact details and whatever you choose to
            share in the conversation. If you go on to book a retreat, we may ask for further details needed to
            organise it (such as passport details, dietary needs or health information you choose to share); these
            are handled as described in this policy and in your booking agreement.
          </p>
          <p>
            <strong>Information collected automatically.</strong> Like most websites, our hosting provider records
            basic technical data such as your IP address, browser type and the pages you request, for security and
            to keep the website running. We also use privacy-friendly visitor statistics (see{' '}
            <a href="#cookies">Cookies and similar technologies</a>).
          </p>
        </>
      ),
    },
    {
      id: 'how-we-use',
      heading: 'How we use your information',
      body: (
        <>
          <p>We use your information to:</p>
          <ul>
            <li>reply to your enquiry and discuss your retreat or booking;</li>
            <li>prepare proposals, organise retreats and provide the services you ask for;</li>
            <li>keep the website secure and protect it against spam and misuse;</li>
            <li>understand, in aggregate, how the website is used so we can improve it;</li>
            <li>meet our legal, accounting and tax obligations.</li>
          </ul>
          <p>
            We do not sell your personal information, and we do not add you to a marketing mailing list without
            your clear permission.
          </p>
        </>
      ),
    },
    {
      id: 'legal-basis',
      heading: 'Legal basis',
      body: (
        <>
          <p>
            Where the EU General Data Protection Regulation (GDPR) or Egypt&apos;s Personal Data Protection Law
            (Law No. 151 of 2020) applies, we rely on the following grounds:
          </p>
          <ul>
            <li><strong>Steps before a contract and the contract itself</strong> — answering your enquiry and organising your retreat;</li>
            <li><strong>Legitimate interests</strong> — running, securing and improving our website and business;</li>
            <li><strong>Consent</strong> — where you choose to share optional information, such as health or dietary details; you may withdraw consent at any time;</li>
            <li><strong>Legal obligation</strong> — keeping records required by law.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'sharing',
      heading: 'Who we share it with',
      body: (
        <>
          <p>We only share your information where needed, with:</p>
          <ul>
            <li>
              <strong>Service providers</strong> that run our website and tools on our behalf — Vercel (website
              hosting and visitor statistics), Sanity (secure storage of the content management system, including
              enquiries) and our email provider;
            </li>
            <li>
              <strong>Retreat partners</strong> such as hotels, transport companies and guides, but only the details
              they need to provide your retreat, and only once you are booking with us;
            </li>
            <li>
              <strong>Retreat leaders</strong>, where you join a retreat that we produce for them and they need your
              details to run it;
            </li>
            <li><strong>Authorities</strong>, where we are required to by law.</li>
          </ul>
          <p>
            If you message us on WhatsApp, that conversation is also subject to WhatsApp&apos;s own privacy policy.
          </p>
        </>
      ),
    },
    {
      id: 'transfers',
      heading: 'International transfers',
      body: (
        <p>
          We work between Egypt and Italy, and some of our service providers store data in other countries, including
          the United States. Where your information is transferred outside the country it was collected in, we rely on
          appropriate safeguards offered by those providers, such as the European Commission&apos;s Standard
          Contractual Clauses.
        </p>
      ),
    },
    {
      id: 'cookies',
      heading: 'Cookies and similar technologies',
      body: (
        <>
          <p>We keep cookies to a minimum:</p>
          <ul>
            <li>
              <strong>Visitor statistics</strong> — we use Vercel Web Analytics, which measures page views in aggregate
              without using cookies and without identifying individual visitors.
            </li>
            <li>
              <strong>Language</strong> — if you switch the website to Italian, Google Translate stores a small
              preference cookie (<code>googtrans</code>) so the translation stays on as you browse. Choosing English
              again removes it.
            </li>
            <li>
              <strong>Google services</strong> — the translation tool and our web fonts are loaded from Google, so
              Google receives your IP address and basic browser information when the page loads. See Google&apos;s
              privacy policy for how Google handles this data.
            </li>
          </ul>
          <p>You can block or delete cookies at any time in your browser settings.</p>
        </>
      ),
    },
    {
      id: 'retention',
      heading: 'How long we keep it',
      body: (
        <p>
          We keep enquiries for as long as we need them to talk with you about your retreat, and generally no longer
          than 24 months after our last contact if no booking follows. Information related to bookings is kept for as
          long as required for accounting, tax and legal purposes. When we no longer need your information, we delete
          it.
        </p>
      ),
    },
    {
      id: 'security',
      heading: 'How we protect it',
      body: (
        <p>
          The website is served over a secure (HTTPS) connection. Enquiries are stored privately and can only be
          accessed by authorised people through our password-protected admin area. No system is completely secure,
          but we take reasonable steps to protect your information.
        </p>
      ),
    },
    {
      id: 'your-rights',
      heading: 'Your rights',
      body: (
        <>
          <p>Depending on where you live, you have the right to:</p>
          <ul>
            <li>access the personal information we hold about you;</li>
            <li>ask us to correct or update it;</li>
            <li>ask us to delete it;</li>
            <li>object to or ask us to limit how we use it;</li>
            <li>receive a copy of it in a portable format;</li>
            <li>withdraw your consent at any time, where we rely on consent.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at <a href={`mailto:${email}`}>{email}</a>. We will reply
            within one month. You also have the right to complain to a data protection authority — in Italy, the
            Garante per la protezione dei dati personali; in Egypt, the Personal Data Protection Centre; or the
            authority in your own country.
          </p>
        </>
      ),
    },
    {
      id: 'children',
      heading: 'Children',
      body: (
        <p>
          This website is intended for adults. We do not knowingly collect personal information from anyone under 18.
          If you believe a child has sent us their details, please contact us and we will delete them.
        </p>
      ),
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      body: (
        <p>
          We may update this Privacy Policy from time to time. The latest version will always be on this page, with
          the date it was last updated.
        </p>
      ),
    },
  ]

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <p>
          Your privacy matters to us. This policy explains what personal information we collect when you visit our
          website or get in touch, why we collect it and the choices you have.
        </p>
      }
      sections={sections}
    />
  )
}
