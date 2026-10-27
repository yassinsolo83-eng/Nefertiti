import { createImageUrlBuilder } from '@sanity/image-url'

// Same project/dataset as the write/read clients.
const builder = createImageUrlBuilder({ projectId: '205jlscz', dataset: 'production' })

// A partner photo can be either a raw Sanity image object (with hotspot/crop,
// set from the Studio) or a plain string URL (the built-in fallback images).
export type ImageSource = string | { asset?: unknown; hotspot?: unknown; crop?: unknown; _type?: string } | null | undefined

// Builds a URL that crops the image to an exact box, honouring the hotspot and
// crop the editor set in the Studio. Any uploaded photo comes out at the same
// size and framing, so it always fits the layout.
export function cropUrl(source: ImageSource, w: number, h: number): string {
  if (!source) return ''
  if (typeof source === 'string') return source // built-in fallback: already a URL
  try {
    return builder.image(source as any).width(w).height(h).fit('crop').auto('format').quality(75).url() || ''
  } catch {
    return ''
  }
}

// Same photo at its natural proportions (no cropping), limited to a maximum width.
// The editor's Studio crop is still honoured; the hotspot only matters when cropping.
export function fitUrl(source: ImageSource, maxWidth: number): string {
  if (!source) return ''
  if (typeof source === 'string') return source // built-in fallback: already a URL
  try {
    return builder.image(source as any).width(maxWidth).fit('max').auto('format').quality(75).url() || ''
  } catch {
    return ''
  }
}
