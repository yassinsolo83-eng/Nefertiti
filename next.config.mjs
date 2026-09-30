/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  // Sanity Studio is a single page at app/studio/page.tsx.
  // Every deeper Studio URL (e.g. /studio/structure/retreat) is served by that same page.
  async rewrites() {
    return [{ source: '/studio/:path+', destination: '/studio' }]
  },
}

export default nextConfig
