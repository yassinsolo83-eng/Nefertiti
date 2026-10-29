// Small round social icons. Only real profile links are shown (never bare placeholders like https://instagram.com).
type Props = { links: [string, string][]; className?: string }

function isProfileLink(url: string) {
  try {
    return new URL(url).pathname.replace(/\/$/, '').length > 1
  } catch {
    return false
  }
}

function Icon({ label }: { label: string }) {
  const k = label.toLowerCase()
  if (k.includes('instagram')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
      </svg>
    )
  }
  if (k.includes('facebook')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14 8h2V5h-2.5C11 5 10 6.5 10 8.5V11H8v3h2v6h3v-6h2.2l.5-3H13V8.8c0-.5.3-.8 1-.8z" />
      </svg>
    )
  }
  if (k.includes('linkedin')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 9h3v11H4z" />
        <circle cx="5.5" cy="5.5" r="1.7" />
        <path d="M10 9h3v1.6c.5-1 1.6-1.8 3.2-1.8 3 0 3.8 2 3.8 4.6V20h-3v-5.8c0-1.4-.4-2.4-1.8-2.4-1.5 0-2.2 1-2.2 2.5V20h-3z" />
      </svg>
    )
  }
  return <span aria-hidden="true" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.04em' }}>{label.slice(0, 2).toUpperCase()}</span>
}

export default function SocialIcons({ links, className = '' }: Props) {
  const real = links.filter(([, url]) => isProfileLink(url))
  if (real.length === 0) return null
  return (
    <div className={`social-icons ${className}`}>
      {real.map(([label, url]) => (
        <a key={url} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
          <Icon label={label} />
        </a>
      ))}
    </div>
  )
}
