import { defineField, defineType } from 'sanity'

// Nefertiti's own retreats, shown on /retreats.
// A retreat moves to "Past Retreats" automatically once its end date has passed.
export const retreat = defineType({
  name: 'retreat',
  title: 'Retreats',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'programme', title: 'Programme' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Retreat Name',
      type: 'string',
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'main',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'main',
      description: 'Ignored once the retreat has ended — it then shows under Past Retreats.',
      options: {
        list: [
          { title: 'Open for booking', value: 'open' },
          { title: 'Few spots left', value: 'few' },
          { title: 'Sold out', value: 'soldout' },
          { title: 'Coming soon', value: 'soon' },
        ],
        layout: 'radio',
      },
      initialValue: 'open',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'main',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'destination',
      title: 'Destination',
      type: 'reference',
      group: 'main',
      to: [{ type: 'destination' }],
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      group: 'main',
      validation: (r) =>
        r.required().custom((end, ctx) => {
          const start = (ctx.document as { startDate?: string })?.startDate
          if (start && end && end < start) return 'End date must be after the start date'
          return true
        }),
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      group: 'main',
      description: 'One or two sentences shown on the retreat card.',
      validation: (r) => r.max(260).warning('Keep it short — this appears on the card'),
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'text',
      rows: 8,
      group: 'programme',
      description: 'Shown at the top of the retreat page. Leave an empty line between paragraphs.',
    }),
    defineField({
      name: 'itinerary',
      title: 'Programme (day by day)',
      type: 'array',
      group: 'programme',
      of: [
        {
          type: 'object',
          name: 'itineraryDay',
          fields: [
            { name: 'day', title: 'Day Label', type: 'string', description: 'e.g. "Day 1" or "Days 2–3"' },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'title', subtitle: 'day' } },
        },
      ],
    }),
    defineField({
      name: 'included',
      title: "What's Included",
      type: 'array',
      group: 'programme',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'facilitators',
      title: 'Facilitators',
      type: 'array',
      group: 'programme',
      of: [{ type: 'reference', to: [{ type: 'partner' }] }],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  orderings: [
    { title: 'Start date (newest first)', name: 'startDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', start: 'startDate', end: 'endDate', media: 'coverImage' },
    prepare({ title, start, end, media }) {
      return { title, subtitle: [start, end].filter(Boolean).join(' → '), media }
    },
  },
})
