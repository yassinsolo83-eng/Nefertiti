import { defineField, defineType } from 'sanity'

// One hidden document the website updates on every home page visit.
// It is not listed in the Studio sidebar and nobody needs to edit it:
// the starting number and the on/off switch live in Site Settings.
export const visitorCounter = defineType({
  name: 'visitorCounter',
  title: 'Visitor Counter',
  type: 'document',
  fields: [
    defineField({
      name: 'count',
      title: 'Visits counted by the site',
      type: 'number',
      readOnly: true,
    }),
  ],
})
