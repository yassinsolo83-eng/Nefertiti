import { defineField, defineType } from 'sanity'

// Companies and brands that Nefertiti collaborates with (shown on the Collaborations page and the home page)
export const collaboration = defineType({
  name: 'collaboration',
  title: 'Collaboration',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company / Brand Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Any size works: the logo is shown whole inside a fixed box. A transparent or white background looks best.',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      description: 'e.g. "United Kingdom", "India"',
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences about the company or the collaboration.',
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Smaller numbers come first. The home page shows the first six.',
    }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'country', media: 'logo' },
  },
})
