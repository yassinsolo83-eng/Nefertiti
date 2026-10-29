import { sanityImg } from '@/lib/img'

type Props = Omit<React.ComponentPropsWithRef<'img'>, 'src'> & {
  src?: string | null
  /** Above-the-fold image (the largest one on screen when the page opens): load it first. */
  priority?: boolean
  /** Widest copy to generate for Sanity images. */
  maxWidth?: number
}

// Drop-in replacement for <img>: responsive sizes for Sanity photos, lazy loading by default.
export default function Img({ src, priority, maxWidth, sizes, loading, ...rest }: Props) {
  const img = sanityImg(src, maxWidth)
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      src={img.src || undefined}
      srcSet={img.srcSet}
      sizes={img.srcSet ? sizes || '100vw' : sizes}
      loading={priority ? 'eager' : loading || 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  )
}
