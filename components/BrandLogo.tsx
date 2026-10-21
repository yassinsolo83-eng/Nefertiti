// The Nefertiti lockup: emblem + name. Both are SVG files painted with the current
// text colour, so the same logo works on dark video (gold) and on ivory (plum).
export default function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`brand-logo ${className}`} role="img" aria-label="Nefertiti — retreats producer">
      <span className="brand-logo-emblem" aria-hidden="true" />
      <span className="brand-logo-word" aria-hidden="true" />
    </span>
  )
}
