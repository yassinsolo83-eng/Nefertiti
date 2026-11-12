/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  // English lives at the root (/about) and Italian under /it (/it/about).
  // Every page file sits in app/[lang], so English paths are rewritten to /en/... behind the scenes.
  async rewrites() {
    // English pages: one plain rule pair per top-level page (no regular expressions)
    const pages = ['about', 'collaborations', 'contact', 'destinations', 'experiences', 'how-it-works', 'partners', 'pre-call', 'privacy', 'retreats', 'services', 'terms']
    return {
      beforeFiles: [
        { source: '/', destination: '/en' },
        ...pages.flatMap((p) => [
          { source: `/${p}`, destination: `/en/${p}` },
          { source: `/${p}/:rest*`, destination: `/en/${p}/:rest*` },
        ]),
      ],
      // Sanity Studio is a single page at app/studio/page.tsx.
      // Every deeper Studio URL (e.g. /studio/structure/retreat) is served by that same page.
      afterFiles: [{ source: '/studio/:path+', destination: '/studio' }],
      // Anything that matches no page ends up on the 404 page of its language
      fallback: [
        { source: '/it/:path*', destination: '/it/missing' },
        { source: '/en/:path*', destination: '/en/missing' },
        { source: '/:path*', destination: '/en/missing' },
      ],
    }
  },
  async redirects() {
    // /en/... is the same page as /...: keep one address for search engines
    return [
      // One address for the Red Sea page (the Google-indexed one)
      { source: '/destinations/the-red-sea', destination: '/destinations/red-sea', permanent: true },
      { source: '/it/destinations/the-red-sea', destination: '/it/destinations/red-sea', permanent: true },
      { source: '/en', destination: '/', permanent: true },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
    ]
  },
}

export default nextConfig
