import { notFound } from 'next/navigation'

// Addresses that match no page are rewritten here (see next.config.mjs) so they get the
// normal 404 page, in the visitor's language.
export default function Missing() {
  notFound()
}
