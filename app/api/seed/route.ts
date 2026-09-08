import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import {
  featuredDestinations, moreDestinations, destinationDetails,
  experiences, partners, faqs, serviceTiers, copy,
} from '@/lib/data'

const client = createClient({
  projectId: '205jlscz',
  dataset: 'production',
  apiVersion: '2025-06-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

// ── Image upload helper with cache ──
const imageCache = new Map<string, any>()

async function uploadImage(localPath: string, baseUrl: string) {
  if (!localPath || localPath.startsWith('http')) return null
  if (imageCache.has(localPath)) return imageCache.get(localPath)

  try {
    const url = `${baseUrl}${localPath}`
    const res = await fetch(url)
    if (!res.ok) { console.log(`⚠ Skip image ${localPath}: ${res.status}`); return null }

    const buffer = Buffer.from(await res.arrayBuffer())
    const filename = localPath.split('/').pop() || 'image.webp'
    const asset = await client.assets.upload('image', buffer, { filename })

    const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    imageCache.set(localPath, ref)
    return ref
  } catch (e: any) {
    console.log(`⚠ Image upload failed ${localPath}: ${e.message}`)
    return null
  }
}

// ── Main seed function ──
export async function GET(req: Request) {
  if (!process.env.SANITY_WRITE_TOKEN) {
    return NextResponse.json({ error: 'SANITY_WRITE_TOKEN not set' }, { status: 500 })
  }

  const baseUrl = `https://${process.env.VERCEL_URL || 'nefertiti-mu.vercel.app'}`
  const results: string[] = []

  try {
    // ────────────────────────────────────
    // 1. DESTINATIONS (featured + more)
    // ────────────────────────────────────
    const allDests = [
      ...featuredDestinations.map((d, i) => ({ ...d, featured: true, order: i + 1 })),
      ...moreDestinations.map((d, i) => ({ ...d, featured: false, order: i + 100 })),
    ]

    for (const dest of allDests) {
      const coverImg = await uploadImage(dest.image, baseUrl)
      const detail = destinationDetails[dest.id]

      let parallaxImg = null
      let highlights: any[] = []

      if (detail) {
        parallaxImg = await uploadImage(detail.parallaxImage, baseUrl)
        highlights = await Promise.all(
          detail.highlights.map(async (h) => ({
            _type: 'object',
            _key: h.title.replace(/\s+/g, '-').toLowerCase(),
            title: h.title,
            desc: h.desc,
            image: await uploadImage(h.image, baseUrl),
          }))
        )
      }

      await client.createOrReplace({
        _type: 'destination',
        _id: `dest-${dest.id}`,
        title: dest.title,
        slug: { _type: 'slug', current: dest.id },
        feeling: dest.feeling,
        tagline: dest.tagline,
        desc: dest.desc,
        ...(coverImg && { image: coverImg }),
        ...(dest.video && { video: dest.video }),
        featured: dest.featured,
        order: dest.order,
        experiences: dest.experiences,
        idealFor: dest.idealFor,
        ...(detail && {
          overview: detail.overview,
          bestTime: detail.bestTime,
          ...(parallaxImg && { parallaxImage: parallaxImg }),
          ...(highlights.length && { highlights }),
        }),
      })

      results.push(`✅ Destination: ${dest.title}`)
    }

    // ────────────────────────────────────
    // 2. EXPERIENCES
    // ────────────────────────────────────
    for (let i = 0; i < experiences.length; i++) {
      const exp = experiences[i]
      const img = await uploadImage(exp.image, baseUrl)

      await client.createOrReplace({
        _type: 'experience',
        _id: `exp-${exp.title.replace(/\s+/g, '-').toLowerCase()}`,
        title: exp.title,
        text: exp.text,
        ...(img && { image: img }),
        order: i + 1,
      })

      results.push(`✅ Experience: ${exp.title}`)
    }

    // ────────────────────────────────────
    // 3. PARTNERS
    // ────────────────────────────────────
    for (let i = 0; i < partners.length; i++) {
      const p = partners[i]
      const img = await uploadImage(p.image, baseUrl)

      await client.createOrReplace({
        _type: 'partner',
        _id: `partner-${p.id}`,
        name: p.name,
        slug: { _type: 'slug', current: p.id },
        category: p.category,
        tagline: p.tagline,
        bio: p.bio,
        ...(img && { image: img }),
        services: p.services,
        location: p.location || '',
        website: p.website || undefined,
        instagram: p.instagram || '',
        x: p.x || '',
        tiktok: p.tiktok || '',
        order: i + 1,
      })

      results.push(`✅ Partner: ${p.name} (${p.category})`)
    }

    // ────────────────────────────────────
    // 4. FAQs
    // ────────────────────────────────────
    for (let i = 0; i < faqs.length; i++) {
      const [q, a] = faqs[i]

      await client.createOrReplace({
        _type: 'faq',
        _id: `faq-${i + 1}`,
        question: q,
        answer: a,
        order: i + 1,
      })

      results.push(`✅ FAQ: ${q.slice(0, 40)}...`)
    }

    // ────────────────────────────────────
    // 5. SERVICE TIERS
    // ────────────────────────────────────
    for (let i = 0; i < serviceTiers.length; i++) {
      const tier = serviceTiers[i]

      await client.createOrReplace({
        _type: 'serviceTier',
        _id: `tier-${tier.num.toLowerCase()}`,
        name: `${tier.num}. ${tier.title}`,
        description: tier.desc,
        features: tier.items,
        order: i + 1,
      })

      results.push(`✅ Service Tier: ${tier.title}`)
    }

    // ────────────────────────────────────
    // 6. SITE CONTENT (texts from copy.en)
    // ────────────────────────────────────
    const t = copy.en

    const siteBlocks = [
      { section: 'hero', heading: t.hero, body: t.heroText, buttonText: t.explore },
      { section: 'vision', heading: t.visionTitle, body: t.visionText, buttonText: t.philosophy },
      { section: 'destinations', heading: t.destinations, subheading: t.destinationLabel, body: t.destinationText },
      { section: 'experiences', heading: t.experiences, body: t.experienceText },
      { section: 'services', heading: t.bespoke, subheading: t.bespokeLabel, body: t.bespokeText },
      { section: 'cta', heading: t.cta, body: t.ctaText, buttonText: t.contact },
      { section: 'founder', heading: t.founderName, subheading: t.founderRole, body: t.founderText },
    ]

    for (const block of siteBlocks) {
      await client.createOrReplace({
        _type: 'siteContent',
        _id: `site-${block.section}`,
        ...block,
      })

      results.push(`✅ Site Content: ${block.section}`)
    }

    // ────────────────────────────────────
    // DONE
    // ────────────────────────────────────
    return NextResponse.json({
      success: true,
      message: `Seeded ${results.length} items`,
      imagesUploaded: imageCache.size,
      details: results,
    })

  } catch (err: any) {
    return NextResponse.json({
      error: err.message,
      details: results,
    }, { status: 500 })
  }
}
