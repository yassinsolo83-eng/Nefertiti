'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'

// Sanity Studio lives at /studio. Deeper Studio URLs (/studio/structure/...)
// are rewritten to this page in next.config.mjs, so no catch-all folder is needed.
export default function StudioPage() {
  return <NextStudio config={config} />
}
