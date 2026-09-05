import { defineField, defineType } from 'sanity'

export const siteContent = defineType({
  name: 'siteContent',
  title: 'Site Content',
  type: 'document',
  fields: [
    defineField({
      name: 'section',
      title: 'Section',
      type: 'string',
      validation: (r) => r.required(),
      description: 'e.g. "hero", "vision", "cta", "destinationsIntro"',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image (optional)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'section', subtitle: 'heading' },
  },
})
