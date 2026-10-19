'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@/sanity/schema'
import { structure } from '@/sanity/structure'
import { importDefaultsTool } from '@/sanity/tools/importDefaults'

// Types that must never be created by hand in the Studio:
// - siteSettings / pageImages / preCallForm: there is exactly one document of each
// - enquiry / preCallSubmission / visitorCounter: created only by the website itself
const NO_CREATE = new Set(['siteSettings', 'pageImages', 'preCallForm', 'enquiry', 'preCallSubmission', 'visitorCounter'])
const SINGLETONS = new Set(['siteSettings', 'pageImages', 'preCallForm'])

export default defineConfig({
  name: 'nefertiti',
  title: 'Nefertiti Retreats',

  projectId: '205jlscz',
  dataset: 'production',
  basePath: '/studio',

  plugins: [structureTool({ structure }), visionTool()],

  tools: (prev) => [...prev, importDefaultsTool],

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !NO_CREATE.has(t.schemaType)),
  },

  document: {
    // Hide "Create new" for those types in the global + button
    newDocumentOptions: (prev) => prev.filter((item) => !NO_CREATE.has(item.templateId)),
    // Single documents can be edited and published, but not deleted or duplicated
    actions: (prev, ctx) =>
      SINGLETONS.has(ctx.schemaType)
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish')
        : prev,
  },
})
