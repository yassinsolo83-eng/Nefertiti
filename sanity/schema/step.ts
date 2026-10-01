import { defineField, defineType } from 'sanity'

export const step = defineType({
  name: 'step',
  title: 'How It Works — Step',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Step Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown when this step is selected on the How It Works page.',
    }),
    defineField({
      name: 'order',
      title: 'Step Number',
      type: 'number',
      validation: (r) => r.required(),
    }),
  ],
  orderings: [{ title: 'Step Number', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', order: 'order', media: 'image' },
    prepare: ({ title, order, media }) => ({ title: `${order}. ${title}`, media }),
  },
})
