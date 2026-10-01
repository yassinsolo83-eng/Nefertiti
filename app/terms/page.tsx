import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'
import { getSiteSettings } from '@/sanity/lib/queries'
import LegalPage, { type LegalSection } from '@/components/LegalPage'

const UPDATED = '1 October 2026'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    fallbackSeo: settings.seo.default,
    title: 'Terms & Conditions',
    description: 'The terms that apply when you use the Nefertiti Retreats website, send an enquiry or book a retreat in Egypt.',
    path: '/terms',
  })
}

export default async function TermsPage() {
  const settings = await getSiteSettings()
  const email = settings.contactEmail

  const sections: LegalSection[] = [
    {
      id: 'about-us',
      heading: 'Who we are',
      body: (
        <>
          <p>
            This website is operated by <strong>Nefertiti Retreats</strong> (&ldquo;Nefertiti&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;, &ldquo;our&rdquo;), a retreat producer based between Egypt and Italy. We design and produce
            wellness retreats in Egypt for coaches, facilitators and retreat leaders, and we also host our own retreats.
          </p>
          <p>
            You can reach us at any time at <a href={`mailto:${email}`}>{email}</a>.
          </p>
        </>
      ),
    },
    {
      id: 'using-the-site',
      heading: 'Using this website',
      body: (
        <>
          <p>By using this website you agree to these Terms. If you do not agree, please do not use the website.</p>
          <p>When using the website, you agree not to:</p>
          <ul>
            <li>use it for any unlawful purpose or in a way that could damage, disable or overload it;</li>
            <li>try to gain unauthorised access to any part of the website, its admin area or its systems;</li>
            <li>send false, misleading or spam enquiries, or submit another person&apos;s details without their permission;</li>
            <li>copy, scrape or reuse our content, photos or videos without our written permission.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'information',
      heading: 'Information on the website',
      body: (
        <>
          <p>
            Everything on this website — destinations, experiences, services, retreat descriptions, dates and
            photographs — is for general information and inspiration. We work hard to keep it accurate and up to date,
            but details can change (for example venues, programmes, availability or local conditions), and some
            content may be illustrative.
          </p>
          <p>
            Nothing on the website is a binding offer. The exact programme, inclusions and price of any retreat are
            only confirmed in writing, as described below.
          </p>
        </>
      ),
    },
    {
      id: 'enquiries',
      heading: 'Enquiries and WhatsApp',
      body: (
        <>
          <p>
            Sending an enquiry through our contact form, by email or on WhatsApp does not create a booking or a
            contract. It simply starts a conversation. We aim to reply within 48 hours, but we cannot guarantee a
            response time or that we will be able to accommodate every request.
          </p>
          <p>
            How we handle the information you send us is explained in our <a href="/privacy">Privacy Policy</a>.
          </p>
        </>
      ),
    },
    {
      id: 'bookings',
      heading: 'Bookings, prices and payments',
      body: (
        <>
          <p>
            Prices are not published on this website. Every retreat — whether we produce it for you as a retreat
            leader or you join one of our own retreats as a guest — is confirmed through a{' '}
            <strong>separate written proposal or booking agreement</strong>. That document sets out the programme,
            what is and is not included, the price, the payment schedule (including any deposit) and the cancellation
            and refund terms.
          </p>
          <p>
            If anything in your written proposal or booking agreement differs from these Terms, the proposal or
            booking agreement applies to that booking.
          </p>
        </>
      ),
    },
    {
      id: 'third-parties',
      heading: 'Partners and third-party providers',
      body: (
        <>
          <p>
            To create each retreat we work with independent partners such as hotels, camps, boats, transport
            companies, guides, practitioners and activity providers. Some of them are presented on our Partners
            pages. These partners provide their services under their own terms and remain responsible for their
            own services, staff and premises.
          </p>
          <p>
            We choose our partners carefully, but to the extent permitted by law we are not responsible for acts or
            omissions of independent third parties that are outside our reasonable control.
          </p>
        </>
      ),
    },
    {
      id: 'travel',
      heading: 'Travel, health and insurance',
      body: (
        <>
          <p>Unless your booking agreement says otherwise, each traveller is responsible for:</p>
          <ul>
            <li>holding a valid passport and any visa required to enter Egypt;</li>
            <li>arranging comprehensive travel insurance, including medical cover and cancellation cover;</li>
            <li>
              checking that they are fit to take part in the planned activities (such as yoga, desert trips, swimming,
              snorkelling or boat trips) and telling us in advance about any health condition, allergy or dietary
              need that we should be aware of;
            </li>
            <li>following the instructions of guides, instructors and local staff, and respecting local laws and customs.</li>
          </ul>
          <p>
            Wellness activities offered during a retreat are not medical treatment and are not a substitute for
            professional medical advice.
          </p>
        </>
      ),
    },
    {
      id: 'retreat-leaders',
      heading: 'For retreat leaders',
      body: (
        <p>
          If we produce a retreat for you, you remain responsible for the content of your own sessions and teachings,
          for the accuracy of what you tell your participants and for holding any qualifications or insurance your
          practice requires. Our production work and your participants&apos; arrangements are set out in your written
          agreement with us.
        </p>
      ),
    },
    {
      id: 'force-majeure',
      heading: 'Events outside our control',
      body: (
        <p>
          We are not liable for delays, changes or cancellations caused by events beyond our reasonable control, such
          as extreme weather, natural disasters, epidemics, government action, strikes, civil unrest, flight
          disruption or the closure of sites or venues. Where this happens we will do our best to offer a suitable
          alternative, and the consequences for any booking will follow your booking agreement.
        </p>
      ),
    },
    {
      id: 'intellectual-property',
      heading: 'Intellectual property',
      body: (
        <p>
          The Nefertiti name and logo, and the text, photographs, videos and design of this website, belong to us or
          to our licensors and partners. You may view and share links to our pages for personal use, but you may not
          copy, reproduce or use our content commercially without our written permission.
        </p>
      ),
    },
    {
      id: 'links',
      heading: 'Links and translation',
      body: (
        <>
          <p>
            The website may link to other websites and services, such as WhatsApp, Instagram or our partners&apos;
            websites. We do not control those websites and are not responsible for their content or practices.
          </p>
          <p>
            The Italian version of the website is produced by Google Translate. Machine translation may contain
            errors; if there is any difference in meaning, the English version applies.
          </p>
        </>
      ),
    },
    {
      id: 'liability',
      heading: 'Our liability',
      body: (
        <>
          <p>
            We provide this website &ldquo;as is&rdquo;. We do not guarantee that it will always be available,
            uninterrupted or free of errors.
          </p>
          <p>
            To the extent permitted by law, we are not liable for any indirect or consequential loss arising from the
            use of this website. Nothing in these Terms limits any liability that cannot be limited under applicable
            law, including liability for death or personal injury caused by negligence, or for fraud.
          </p>
        </>
      ),
    },
    {
      id: 'law',
      heading: 'Governing law',
      body: (
        <p>
          These Terms are governed by the laws of the Arab Republic of Egypt. This does not take away any mandatory
          protection you have under the consumer laws of the country where you live.
        </p>
      ),
    },
    {
      id: 'changes',
      heading: 'Changes to these Terms',
      body: (
        <p>
          We may update these Terms from time to time. The version published on this page, with its &ldquo;last
          updated&rdquo; date, is the one that applies. Changes do not affect bookings that were already confirmed in
          writing.
        </p>
      ),
    },
    {
      id: 'contact',
      heading: 'Contact us',
      body: (
        <p>
          Questions about these Terms? Email us at <a href={`mailto:${email}`}>{email}</a> or reach us through our{' '}
          <a href="/contact">contact page</a>.
        </p>
      ),
    },
  ]

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated={UPDATED}
      intro={
        <p>
          These terms explain the rules for using the Nefertiti Retreats website and how enquiries and bookings work.
          Please read them carefully.
        </p>
      }
      sections={sections}
    />
  )
}
