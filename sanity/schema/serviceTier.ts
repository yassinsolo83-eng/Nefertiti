import { defineField, defineType } from 'sanity'

export const serviceTier = defineType({
  name: 'serviceTier',
  title: 'Service Tier',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tier Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price Label',
      type: 'string',
      description: 'e.g. "From $2,500"',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'price' },
  },
})
