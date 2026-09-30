'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@/sanity/schema'
import { structure } from '@/sanity/structure'

// Types that must never be created by hand in the Studio:
// - siteSettings: there is exactly one settings document
// - enquiry: created only by the website's contact form
const NO_CREATE = new Set(['siteSettings', 'enquiry'])

export default defineConfig({
  name: 'nefertiti',
  title: 'Nefertiti Retreats',

  projectId: '205jlscz',
  dataset: 'production',
  basePath: '/studio',

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !NO_CREATE.has(t.schemaType)),
  },

  document: {
    // Hide "Create new" for those types in the global + button
    newDocumentOptions: (prev) => prev.filter((item) => !NO_CREATE.has(item.templateId)),
    // Site Settings can be edited and published, but not deleted or duplicated
    actions: (prev, ctx) =>
      ctx.schemaType === 'siteSettings'
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish')
        : prev,
  },
})
