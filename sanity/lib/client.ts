import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: '205j1scz',
  dataset: 'production',
  apiVersion: '2025-06-01',
  useCdn: true,
})
