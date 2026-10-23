/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build a fully static site into /out so it can be hosted on GitHub Pages.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
