// Sanity serves the original upload unless a size is asked for, and editors often upload
// multi-megabyte photos. This builds a responsive set of resized copies (WebP/AVIF when the
// browser supports it) so each visitor downloads only what the screen needs.
const WIDTHS = [480, 800, 1200, 1600, 2000]

export function sanityImg(url: string | undefined | null, maxWidth = 1600): { src: string; srcSet?: string } {
  if (!url) return { src: '' }
  // Only plain Sanity CDN URLs: static files and already-sized URLs (with "?") stay as they are
  if (!url.startsWith('https://cdn.sanity.io/') || url.includes('?')) return { src: url }
  const widths = WIDTHS.filter((w) => w <= maxWidth)
  const make = (w: number) => `${url}?w=${w}&auto=format&q=75`
  return {
    src: make(Math.min(1200, maxWidth)),
    srcSet: widths.map((w) => `${make(w)} ${w}w`).join(', '),
  }
}
