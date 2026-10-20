// Egyptian brand motifs from the Nefertiti identity (drawn as SVG files in /public/brand).
// They are painted with the current text colour, so any colour can be set from CSS.
const RATIO: Record<string, number> = {
  ankh: 568 / 941,
  cartouche: 435 / 700,
  'cartouche-ankh': 435 / 700,
  lotus: 569 / 700,
  sun: 703 / 700,
}

export type MotifName = keyof typeof RATIO

export default function Motif({
  name,
  height = 28,
  className = '',
}: {
  name: MotifName
  height?: number
  className?: string
}) {
  const url = `url(/brand/${name}.svg)`
  return (
    <span
      aria-hidden="true"
      className={`motif ${className}`}
      style={{
        height,
        width: height * RATIO[name],
        WebkitMaskImage: url,
        maskImage: url,
      }}
    />
  )
}

// Repeating arch band from the identity
export function BrandBand({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`brand-band ${className}`} />
}

// Small divider: line - motif - line. Sits under a section label or eyebrow.
export function Ornament({ name, height = 32, center = false }: { name: MotifName; height?: number; center?: boolean }) {
  return (
    <div className={`ornament${center ? ' ornament-center' : ''}`} aria-hidden="true">
      <Motif name={name} height={height} />
    </div>
  )
}
