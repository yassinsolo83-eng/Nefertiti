// The Nefertiti lockup (emblem + name) as one SVG file painted with the current text colour,
// so the same logo is white over the hero video and plum on ivory.
export default function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-logo ${className}`} role="img" aria-label="Nefertiti — retreats producer">
      <span className="brand-logo-mark" aria-hidden="true" />
    </span>
  )
}
