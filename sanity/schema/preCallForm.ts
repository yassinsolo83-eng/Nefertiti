import { defineArrayMember, defineField, defineType } from 'sanity'

const TYPE_LABELS: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  shortText: 'Short answer',
  longText: 'Long answer',
  url: 'Website / social link',
  single: 'Choose one',
  multiple: 'Choose several',
}

const HOURS = Array.from({ length: 25 }, (_, h) => ({ title: `${String(h).padStart(2, '0')}:00`, value: h }))

const isChoice = (parent?: { type?: string }) => parent?.type === 'single' || parent?.type === 'multiple'

const question = defineArrayMember({
  name: 'question',
  title: 'Question',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Question',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Answer type',
      type: 'string',
      initialValue: 'shortText',
      options: {
        list: Object.entries(TYPE_LABELS).map(([value, title]) => ({ value, title })),
      },
      description: 'Use "Name" and "Email" for the person\'s name and email — they are used to reply to them.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: false,
      description: 'Turn on to make this question mandatory.',
    }),
    defineField({
      name: 'help',
      title: 'Help text',
      type: 'text',
      rows: 2,
      description: 'Optional small text shown under the question.',
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'string',
      description: 'Optional hint shown inside the empty answer box.',
      hidden: ({ parent }) => isChoice(parent),
    }),
    defineField({
      name: 'options',
      title: 'Choices',
      type: 'array',
      of: [{ type: 'string' }],
      hidden: ({ parent }) => !isChoice(parent),
      validation: (r) =>
        r.custom((value, ctx) => {
          if (!isChoice(ctx.parent as { type?: string })) return true
          return Array.isArray(value) && value.length > 0 ? true : 'Add at least one choice.'
        }),
    }),
    defineField({
      name: 'allowOther',
      title: 'Add an "Other" choice with a text box',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !isChoice(parent),
    }),
  ],
  preview: {
    select: { title: 'label', type: 'type', required: 'required' },
    prepare: ({ title, type, required }) => ({
      title: `${required ? '★ ' : ''}${title || 'Untitled question'}`,
      subtitle: `${TYPE_LABELS[type] || type}${required ? ' · Required' : ' · Optional'}`,
    }),
  },
})

const step = defineArrayMember({
  name: 'step',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Step title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Short description', type: 'string' }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [question],
      validation: (r) => r.min(1),
    }),
  ],
  preview: {
    select: { title: 'title', questions: 'questions' },
    prepare: ({ title, questions }) => ({
      title: title || 'Untitled step',
      subtitle: `${(questions || []).length} question(s)`,
    }),
  },
})

// One single document: the questions, steps and texts of the /pre-call page
export const preCallForm = defineType({
  name: 'preCallForm',
  title: 'Pre-Call Form',
  type: 'document',
  groups: [
    { name: 'questions', title: 'Steps & Questions', default: true },
    { name: 'intro', title: 'Intro' },
    { name: 'thanks', title: 'Thank You' },
    { name: 'booking', title: 'Booking Calendar' },
    { name: 'notifications', title: 'Notifications' },
  ],
  fields: [
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      group: 'questions',
      of: [step],
      description: 'Each step is one screen of the form. Drag to reorder steps and questions.',
      validation: (r) => r.min(1),
    }),
    defineField({ name: 'eyebrow', title: 'Small label', type: 'string', group: 'intro' }),
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'intro' }),
    defineField({ name: 'intro', title: 'Intro text', type: 'text', rows: 6, group: 'intro' }),
    defineField({ name: 'submitLabel', title: 'Submit button text', type: 'string', group: 'intro' }),
    defineField({ name: 'successTitle', title: 'Title', type: 'string', group: 'thanks' }),
    defineField({ name: 'successText', title: 'Message', type: 'text', rows: 6, group: 'thanks' }),
    defineField({ name: 'successSignature', title: 'Signature', type: 'string', group: 'thanks' }),
    defineField({
      name: 'bookingTitle',
      title: 'Step title',
      type: 'string',
      group: 'booking',
      description: 'Title of the last step, where the visitor picks a day and time. Empty = "Choose a time".',
    }),
    defineField({ name: 'bookingDescription', title: 'Short description', type: 'string', group: 'booking' }),
    defineField({
      name: 'bookingDays',
      title: 'Available days',
      type: 'array',
      group: 'booking',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Sunday', value: 'sun' },
          { title: 'Monday', value: 'mon' },
          { title: 'Tuesday', value: 'tue' },
          { title: 'Wednesday', value: 'wed' },
          { title: 'Thursday', value: 'thu' },
          { title: 'Friday', value: 'fri' },
          { title: 'Saturday', value: 'sat' },
        ],
      },
      initialValue: ['sun', 'mon', 'tue', 'wed', 'thu'],
      description: 'Days visitors can book. Nothing ticked = Sunday to Thursday.',
    }),
    defineField({
      name: 'bookingStartHour',
      title: 'First time (Cairo time)',
      type: 'number',
      group: 'booking',
      options: { list: HOURS.slice(0, 24) },
      initialValue: 10,
      description: 'Empty = 10:00. Each time is one hour.',
    }),
    defineField({
      name: 'bookingEndHour',
      title: 'Times end at (Cairo time)',
      type: 'number',
      group: 'booking',
      options: { list: HOURS.slice(1) },
      initialValue: 18,
      description: 'Empty = 18:00. Example: 10:00 to 18:00 gives times from 10:00 to 17:00.',
      validation: (r) =>
        r.custom<number>((v, ctx) => {
          const start = (ctx.document as { bookingStartHour?: number } | undefined)?.bookingStartHour
          return v == null || start == null || v > start || 'Must be later than the first time.'
        }),
    }),
    defineField({
      name: 'bookingDaysAhead',
      title: 'How many days ahead visitors can book',
      type: 'number',
      group: 'booking',
      initialValue: 60,
      description: 'Empty = 60 days.',
      validation: (r) => r.integer().min(1).max(365),
    }),
    defineField({
      name: 'bookingBlockedDates',
      title: 'Closed days',
      type: 'array',
      group: 'booking',
      of: [{ type: 'date', options: { dateFormat: 'DD MMM YYYY' } }],
      description: 'Days off (holidays, travel). Visitors see these days as not available.',
    }),
    defineField({
      name: 'notificationEmail',
      title: 'Send new submissions to',
      type: 'string',
      group: 'notifications',
      description: 'Email address that receives each new submission. Leave empty to use the sending Gmail account.',
      validation: (r) =>
        r.custom<string>((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email address.'),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Pre-Call Form' }),
  },
})
