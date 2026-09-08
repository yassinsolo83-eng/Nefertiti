'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '@/sanity/schema'

export default defineConfig({
  name: 'nefertiti',
  title: 'Nefertiti Retreats',

  projectId: '205jlscz',
  dataset: 'production',
  basePath: '/studio',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
