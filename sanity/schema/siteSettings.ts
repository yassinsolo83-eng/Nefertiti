import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'International format, digits only (e.g. 201234567890)',
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'WhatsApp Default Message',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
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
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'combinations',
      title: 'Multi-Destination Combinations',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "Cairo + Red Sea", "Luxor + Nile Journey + Aswan"',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
