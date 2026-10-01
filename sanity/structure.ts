import type { StructureResolver } from 'sanity/structure'

// Sidebar of the Studio, grouped the way the site is used day to day
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Nefertiti')
    .items([
      // Inbox
      S.listItem()
        .title('Enquiries')
        .schemaType('enquiry')
        .child(
          S.documentTypeList('enquiry')
            .title('Enquiries')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }]),
        ),

      S.divider(),

      // Retreats & places
      S.documentTypeListItem('retreat').title('Retreats'),
      S.documentTypeListItem('destination').title('Destinations'),
      S.documentTypeListItem('experience').title('Experiences'),
      S.documentTypeListItem('partner').title('Partners'),

      S.divider(),

      // Page content
      S.documentTypeListItem('serviceTier').title('Service Tiers'),
      S.documentTypeListItem('step').title('How It Works — Steps'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.documentTypeListItem('siteContent').title('Site Content'),
      S.listItem()
        .title('Page Images')
        .schemaType('pageImages')
        .child(S.document().schemaType('pageImages').documentId('pageImages').title('Page Images')),

      S.divider(),

      // One single settings document (WhatsApp, social links, SEO, retreat bar)
      S.listItem()
        .title('Site Settings')
        .schemaType('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')),
    ])
