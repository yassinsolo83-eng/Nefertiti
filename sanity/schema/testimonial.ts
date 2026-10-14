import { defineField, defineType } from 'sanity'

// Words from real clients. The home page section stays hidden until at least one is published.
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 5,
      description: 'Their words, as they wrote or said them.',
      validation: (r) => r.required().max(600),
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'role',
      title: 'Role / brand',
      type: 'string',
      description: 'e.g. "Yoga teacher, Milan" or "Founder, Soul Circle"',
    }),
    defineField({
      name: 'image',
      title: 'Photo (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Only with their permission.',
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number' }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'image' },
  },
})
