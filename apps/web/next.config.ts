import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@playground/ui'],
  images: {
    remotePatterns: [
      { hostname: 'image.tmdb.org' },
      { hostname: 'search1.kakaocdn.net' },
      { hostname: 'covers.openlibrary.org' },
    ],
  },
}

export default nextConfig
