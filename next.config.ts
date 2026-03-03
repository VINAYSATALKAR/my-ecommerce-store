/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // The two asterisks mean "allow images from ANY secure website"
      },
    ],
  },
};

export default nextConfig;