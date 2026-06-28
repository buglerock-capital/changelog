import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
  images: {
    localPatterns: [{ pathname: '/images/**' }],
  },
  async redirects() {
    return [
      {
        source: '/changelog',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
