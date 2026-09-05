import { defineField, defineType } from 'sanity'

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'feeling',
      title: 'Feeling Tag',
      type: 'string',
      description: 'Short mood label, e.g. "Power · Awe · Legacy"',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Italic subtitle under the title',
    }),
    defineField({
      name: 'desc',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'video',
      title: 'Cover Video URL (optional)',
      type: 'url',
      description: 'If set, video plays instead of cover image',
    }),
    defineField({
      name: 'featured',
      title: 'Featured?',
      type: 'boolean',
      description: 'Featured destinations have full detail pages',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
    defineField({
      name: 'experiences',
      title: 'Experiences',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'idealFor',
      title: 'Ideal For',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    // Detail page fields (featured destinations only)
    defineField({
      name: 'overview',
      title: 'Overview Text',
      type: 'text',
      rows: 3,
      description: 'Italic intro paragraph on the detail page',
    }),
    defineField({
      name: 'bestTime',
      title: 'Best Time to Visit',
      type: 'string',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights (Accordion Strip)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'desc', title: 'Description', type: 'text', rows: 2 },
            { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'title', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'parallaxImage',
      title: 'Parallax CTA Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', subtitle: 'feeling', media: 'image' },
  },
})
