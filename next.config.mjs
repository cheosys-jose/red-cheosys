/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sin output: 'standalone' para que next start funcione correctamente
  experimental: {
    serverComponentsExternalPackages: ['meilisearch']
  }
}

export default nextConfig
