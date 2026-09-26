import { defineField, defineType } from 'sanity'

// Messages sent from the Contact page form.
// Created by /api/enquiry — the submitted fields are read-only in the Studio.
export const enquiry = defineType({
  name: 'enquiry',
  title: 'Enquiries',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'new',
    }),
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Phone / WhatsApp', type: 'string', readOnly: true }),
    defineField({ name: 'practice', title: 'Type of Retreat', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 8, readOnly: true }),
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
      const badge = status === 'contacted' ? '✓' : status === 'closed' ? '—' : '●'
      const when = date ? new Date(date).toLocaleDateString('en-GB') : ''
      return { title: `${badge} ${name || 'No name'}`, subtitle: [email, when].filter(Boolean).join(' · ') }
    },
  },
})
