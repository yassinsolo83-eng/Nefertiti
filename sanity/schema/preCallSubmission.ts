import { defineField, defineType } from 'sanity'

// Answers sent from the /pre-call page.
// Created by /api/pre-call — the submitted answers are read-only in the Studio.
export const preCallSubmission = defineType({
  name: 'preCallSubmission',
  title: 'Pre-Call Submissions',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Call booked', value: 'booked' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'new',
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({
      name: 'answers',
      title: 'Answers',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          name: 'answer',
          fields: [
            { name: 'step', title: 'Step', type: 'string' },
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text' },
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
          },
        },
      ],
    }),
    defineField({ name: 'submittedAt', title: 'Received', type: 'datetime', readOnly: true }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Only visible here in the Studio.',
    }),
  ],
  orderings: [
    { title: 'Newest first', name: 'newest', by: [{ field: 'submittedAt', direction: 'desc' }] },
  ],
  preview: {
    select: { name: 'name', email: 'email', status: 'status', date: 'submittedAt' },
    prepare({ name, email, status, date }) {
      const badge = status === 'booked' ? '✓' : status === 'closed' ? '—' : '●'
      const when = date ? new Date(date).toLocaleDateString('en-GB') : ''
      return { title: `${badge} ${name || 'No name'}`, subtitle: [email, when].filter(Boolean).join(' · ') }
    },
  },
})
