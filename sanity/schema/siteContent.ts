import { defineField, defineType } from 'sanity'
import type { ConditionalPropertyCallback } from 'sanity'

// Show only the fields the chosen section actually uses on the site
const onlyFor =
  (...sections: string[]): ConditionalPropertyCallback =>
  ({ document }) =>
    !sections.includes(String(document?.section || ''))

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
      options: {
        list: [
          { title: 'Home — Hero (top of the page)', value: 'hero' },
          { title: 'Home — Why Egypt', value: 'vision' },
          { title: 'Home — Destinations intro', value: 'destinations' },
          { title: 'Home — Final call to action', value: 'cta' },
          { title: 'About — Founder', value: 'founder' },
        ],
      },
      description: 'Which part of the site this text belongs to.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'For "About — Founder" this is the founder\'s name.',
      hidden: onlyFor('hero', 'destinations', 'cta', 'founder'),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Small label above the heading. For "About — Founder" this is the founder\'s role.',
      hidden: onlyFor('destinations', 'founder'),
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
      hidden: onlyFor('hero', 'vision', 'cta'),
    }),
    // Not used by the site — kept hidden so older documents still open cleanly
    defineField({ name: 'buttonLink', title: 'Button Link', type: 'string', hidden: true }),
    defineField({ name: 'image', title: 'Image', type: 'image', hidden: true }),
  ],
  preview: {
    select: { section: 'section', subtitle: 'heading' },
    prepare: ({ section, subtitle }) => ({
      title:
        ({
          hero: 'Home — Hero',
          vision: 'Home — Why Egypt',
          destinations: 'Home — Destinations intro',
          cta: 'Home — Final call to action',
          founder: 'About — Founder',
        } as Record<string, string>)[section] || section,
      subtitle,
    }),
  },
})
