/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.DOCKER_BUILD === "true" ? "standalone" : undefined,
  transpilePackages: ["@radar/shared"]
};

export default nextConfig;
