'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { localePath } from '@/lib/i18n'
import { useLocale } from '@/components/LocaleProvider'

// Drop-in replacement for next/link: internal links keep the visitor's language (/about -> /it/about)
export default function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const locale = useLocale()
  const to = typeof href === 'string' ? localePath(locale, href) : href
  return <NextLink href={to} {...rest} />
}
