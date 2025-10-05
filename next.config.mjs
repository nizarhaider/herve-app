/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "herve-studio-prod.s3.ap-southeast-1.amazonaws.com",
        pathname: "/models_v3/**",
      },
    ],
  },
}

export default nextConfig
