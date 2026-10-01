'use client'

import { useState } from 'react'
import { useClient } from 'sanity'
import type { Tool } from 'sanity'
import {
  copy,
  experiences,
  serviceTiers,
  steps,
  stepImages,
  pageImageDefaults,
  featuredDestinations,
  moreDestinations,
  destinationDetails,
} from '@/lib/data'

type Item = { id: string; fields: Record<string, unknown>; image?: string }

// Compare titles loosely: ignore case and a leading number like "I." / "2." / "III -"
const lower = (v: unknown) =>
  String(v || '')
    .trim()
    .toLowerCase()
    .replace(/^([ivx]+|\d+)\s*[.\-–—:)]\s*/, '')

/**
 * Studio tool that brings the site's built-in content into Sanity so it can be edited:
 *  1. Creates any section that is still empty in the Studio (with its images).
 *  2. Fills every image field that is still empty with the image the site shows today.
 *
 * Safe to press more than once: it never overwrites text or an image that is already set.
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

  const imageField = async (path: string) => ({
    _type: 'image',
    asset: { _type: 'reference', _ref: await uploadImage(path) },
  })

  // ── Step 1: create sections that are still empty ──

  async function importType(type: string, label: string, items: Item[]) {
    const count = await client.fetch<number>('count(*[_type == $type])', { type })
    if (count > 0) return
    for (const item of items) {
      const doc: Record<string, unknown> = { _id: item.id, _type: type, ...item.fields }
      if (item.image) doc.image = await imageField(item.image)
      await client.createIfNotExists(doc as { _id: string; _type: string })
    }
    add(`✓ ${label}: ${items.length} created.`)
  }

  async function importSiteContent() {
    const t = copy.en
    const sections: Record<string, Record<string, string>> = {
      hero: { heading: t.hero, body: t.heroText, buttonText: t.explore },
      vision: { body: t.visionText, buttonText: t.philosophy },
      destinations: { heading: t.destinations, subheading: t.destinationLabel, body: t.destinationText },
      cta: { heading: t.cta, body: t.ctaText, buttonText: t.contact },
      founder: { heading: t.founderName, subheading: t.founderRole, body: t.founderText },
    }
    const existing = await client.fetch<string[]>('*[_type == "siteContent"].section')
    let created = 0
    for (const [section, fields] of Object.entries(sections)) {
      if (existing.includes(section)) continue
      await client.createIfNotExists({ _id: `default-site-content-${section}`, _type: 'siteContent', section, ...fields })
      created++
    }
    if (created) add(`✓ Site Content: ${created} text section(s) created.`)
  }

  async function importPageImagesDoc() {
    const exists = await client.fetch<number>('count(*[_id in ["pageImages", "drafts.pageImages"]])')
    if (exists > 0) return
    await client.createIfNotExists({ _id: 'pageImages', _type: 'pageImages' })
    add('✓ Page Images: created.')
  }

  // ── Step 2: fill empty image fields ──

  // For documents of `type` without an image, find the built-in image by title
  async function fillByTitle(type: string, label: string, titleField: string, images: Map<string, string>) {
    const docs = await client.fetch<{ _id: string; title: string }[]>(
      `*[_type == $type && !defined(image.asset)]{ _id, "title": ${titleField} }`,
      { type },
    )
    let filled = 0
    const unmatched: string[] = []
    for (const d of docs) {
      const path = images.get(lower(d.title))
      if (!path) {
        unmatched.push(d.title || '(untitled)')
        continue
      }
      await client.patch(d._id).set({ image: await imageField(path) }).commit()
      filled++
    }
    if (filled) add(`✓ ${label}: ${filled} missing image(s) filled.`)
    if (unmatched.length) add(`• ${label}: no built-in image for "${unmatched.join('", "')}" — upload one by hand.`)
  }

  async function fillDestinations() {
    const builtIn = new Map([...featuredDestinations, ...moreDestinations].map((d) => [d.id, d.image]))
    const docs = await client.fetch<
      { _id: string; slug: string; title: string; hasImage: boolean; hasParallax: boolean; highlights?: { _key: string; hasImage: boolean }[] }[]
    >(`*[_type == "destination"]{
      _id, "slug": slug.current, title,
      "hasImage": defined(image.asset),
      "hasParallax": defined(parallaxImage.asset),
      "highlights": highlights[]{ _key, "hasImage": defined(image.asset) }
    }`)
    let filled = 0
    for (const d of docs) {
      const set: Record<string, unknown> = {}
      const detail = destinationDetails[d.slug]
      const cover = builtIn.get(d.slug)
      if (!d.hasImage && cover) set.image = await imageField(cover)
      if (!d.hasParallax && detail?.parallaxImage) set.parallaxImage = await imageField(detail.parallaxImage)
      for (const [i, h] of (d.highlights || []).entries()) {
        const path = detail?.highlights?.[i]?.image
        if (!h.hasImage && path) set[`highlights[_key=="${h._key}"].image`] = await imageField(path)
      }
      if (Object.keys(set).length) {
        await client.patch(d._id).set(set).commit()
        filled++
      }
    }
    if (filled) add(`✓ Destinations: missing images filled in ${filled} destination(s).`)
  }

  async function fillPageImages() {
    const docs = await client.fetch<Record<string, unknown>[]>('*[_id in ["pageImages", "drafts.pageImages"]]')
    let filled = 0
    for (const doc of docs) {
      const set: Record<string, unknown> = {}
      for (const [field, path] of Object.entries(pageImageDefaults)) {
        const current = doc[field] as { asset?: unknown } | undefined
        if (!current?.asset) set[field] = await imageField(path)
      }
      if (Object.keys(set).length) {
        await client.patch(doc._id as string).set(set).commit()
        filled += Object.keys(set).length
      }
    }
    if (filled) add(`✓ Page Images: ${filled} missing image(s) filled.`)
  }

  async function run() {
    setRunning(true)
    setLog(['Working… please keep this tab open.'])
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
      await importSiteContent()
      await importPageImagesDoc()

      await fillByTitle('experience', 'Experiences', 'title', new Map(experiences.map((e) => [lower(e.title), e.image])))
      await fillByTitle('serviceTier', 'Service Tiers', 'name', new Map(serviceTiers.map((t) => [lower(t.title), t.image])))
      await fillByTitle('step', 'How It Works — Steps', 'title', new Map(steps.map(([title], i) => [lower(title), stepImages[i]])))
      await fillDestinations()
      await fillPageImages()

      add('Done. Everything is now editable from Structure.')
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
        Brings the website&apos;s built-in content into the Studio so it can be edited: creates any empty section and
        fills every empty image field with the picture the website shows today.
      </p>
      <p style={{ lineHeight: 1.6, opacity: 0.8, marginBottom: 24 }}>
        Safe to press again at any time — text and images that are already set are never changed.
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
        {running ? 'Working…' : 'Import & fill missing images'}
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
