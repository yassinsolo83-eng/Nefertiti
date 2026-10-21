'use client'

import { useEffect, useRef, useState } from 'react'

type Props = Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'preload'> & { src: string }

// A looping muted video that only starts downloading once it is close to the screen.
export default function LazyVideo({ src, ...rest }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return <video ref={ref} src={on ? src : undefined} preload="none" autoPlay muted loop playsInline {...rest} />
}
