'use client'

import { useState } from 'react'
import { useClient } from 'sanity'
import type { Tool } from 'sanity'
import {
  experiences,
  serviceTiers,
  steps,
  stepImages,
  pageImageDefaults,
} from '@/lib/data'

type Item = { id: string; fields: Record<string, unknown>; image?: string }

/**
 * Studio tool: copies the site's built-in content (experiences, service tiers,
 * How It Works steps and page images) into Sanity, together with their current
 * images, so they can be edited in the Studio.
 *
 * It is safe to press more than once: a section that already has documents
 * in Sanity is skipped, so nothing is ever overwritten or duplicated.
 */
function ImportDefaults() {
  const client = useClient({ apiVersion: '2025-06-01' })
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const add = (line: string) => setLog((prev) => [...prev, line])

  // Upload each image file from /public once, reuse the asset afterwards
  const uploaded = new Map<string, string>()
  async function uploadImage(path: string) {
    if (uploaded.has(path)) return uploaded.get(path)!
    const res = await fetch(path)
    if (!res.ok) throw new Error(`Could not load ${path}`)
    const blob = await res.blob()
    const asset = await client.assets.upload('image', blob, { filename: path.split('/').pop() })
    uploaded.set(path, asset._id)
    return asset._id
  }

  const imageField = (assetId: string) => ({
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
  })

  async function importType(type: string, label: string, items: Item[]) {
    const count = await client.fetch<number>('count(*[_type == $type])', { type })
    if (count > 0) {
      add(`• ${label}: already in the Studio (${count}) — skipped.`)
      return
    }
    for (const item of items) {
      const doc: Record<string, unknown> = { _id: item.id, _type: type, ...item.fields }
      if (item.image) doc.image = imageField(await uploadImage(item.image))
      await client.createIfNotExists(doc as { _id: string; _type: string })
    }
    add(`✓ ${label}: ${items.length} imported with their images.`)
  }

  async function importPageImages() {
    const exists = await client.fetch<number>('count(*[_id in ["pageImages", "drafts.pageImages"]])')
    if (exists > 0) {
      add('• Page Images: already in the Studio — skipped.')
      return
    }
    const doc: Record<string, unknown> = { _id: 'pageImages', _type: 'pageImages' }
    for (const [field, path] of Object.entries(pageImageDefaults)) {
      doc[field] = imageField(await uploadImage(path))
    }
    await client.createIfNotExists(doc as { _id: string; _type: string })
    add('✓ Page Images: imported.')
  }

  async function run() {
    setRunning(true)
    setLog(['Importing… please keep this tab open.'])
    try {
      await importType(
        'experience',
        'Experiences',
        experiences.map((e, i) => ({
          id: `default-experience-${i + 1}`,
          fields: { title: e.title, text: e.text, order: i + 1 },
          image: e.image,
        })),
      )
      await importType(
        'serviceTier',
        'Service Tiers',
        serviceTiers.map((t, i) => ({
          id: `default-service-tier-${i + 1}`,
          fields: { name: t.title, description: t.desc, features: t.items, order: i + 1 },
          image: t.image,
        })),
      )
      await importType(
        'step',
        'How It Works — Steps',
        steps.map(([title, description], i) => ({
          id: `default-step-${i + 1}`,
          fields: { title, description, order: i + 1 },
          image: stepImages[i],
        })),
      )
      await importPageImages()
      add('Done. You can now change any image from the sidebar in Structure.')
    } catch (e: any) {
      add(`✗ Stopped: ${e?.message || 'unknown error'}. Press the button again to continue.`)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 24px', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Import Defaults</h1>
      <p style={{ lineHeight: 1.6, opacity: 0.8, marginBottom: 8 }}>
        Copies the website&apos;s built-in Experiences, Service Tiers, How It Works steps and page images into the
        Studio, with their current pictures, so you can edit them.
      </p>
      <p style={{ lineHeight: 1.6, opacity: 0.8, marginBottom: 24 }}>
        Sections that already exist in the Studio are skipped — nothing is overwritten.
      </p>
      <button
        type="button"
        onClick={run}
        disabled={running}
        style={{
          padding: '12px 24px',
          borderRadius: 6,
          border: 0,
          background: '#8D4C65',
          color: '#fff',
          fontSize: 14,
          cursor: running ? 'wait' : 'pointer',
          opacity: running ? 0.6 : 1,
        }}
      >
        {running ? 'Importing…' : 'Import default content'}
      </button>
      {log.length > 0 && (
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14, lineHeight: 1.5 }}>
          {log.map((line, i) => <p key={i} style={{ margin: 0 }}>{line}</p>)}
        </div>
      )}
    </div>
  )
}

export const importDefaultsTool: Tool = {
  name: 'import-defaults',
  title: 'Import Defaults',
  component: ImportDefaults,
}
