import { defineField, defineType } from 'sanity'

// Reusable SEO block. Every field is optional — empty fields fall back to the page defaults.
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title shown in Google results and browser tab. Best under 60 characters.',
      validation: (r) => r.max(70).warning('Google usually cuts titles longer than ~60 characters'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Short summary shown under the title in Google. Best 120–160 characters.',
      validation: (r) => r.max(170).warning('Google usually cuts descriptions longer than ~160 characters'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Share Image',
      type: 'image',
      description: 'Image shown when the link is shared on WhatsApp, Facebook, etc. Ideal size 1200×630.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from Google',
      type: 'boolean',
      description: 'Turn on only for pages that should not appear in search results.',
      initialValue: false,
    }),
  ],
})
