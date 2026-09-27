import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nefertiti Studio',
  robots: { index: false, follow: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      {children}
    </div>
  )
}
