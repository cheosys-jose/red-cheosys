/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Permitir imágenes sin optimización para desarrollo
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/api/images/:path*',
      },
    ];
  },
  // Permitir acceso a archivos estáticos desde public
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
}

export default nextConfig
