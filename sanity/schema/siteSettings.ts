import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      group: 'general',
      description: 'International format, digits only (e.g. 201234567890)',
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp Default Message',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      group: 'general',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'appointmentServices',
      title: 'Appointment Services (dropdown options)',
      type: 'array',
      group: 'general',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'combinations',
      title: 'Multi-Destination Combinations',
      type: 'array',
      group: 'general',
      of: [{ type: 'string' }],
      description: 'e.g. "Cairo + Red Sea", "Luxor + Nile Journey + Aswan"',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO (whole site)',
      type: 'seo',
      group: 'seo',
      description: 'Used for the home page and as a fallback for any page without its own SEO.',
    }),
    defineField({
      name: 'aboutSeo',
      title: 'About page SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'servicesSeo',
      title: 'Services page SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'experiencesSeo',
      title: 'Experiences page SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'howItWorksSeo',
      title: 'How It Works page SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'partnersSeo',
      title: 'Partners page SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'retreatsSeo',
      title: 'Retreats page SEO',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'contactSeo',
      title: 'Contact page SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
