/** @type {import('next').NextConfig} */

module.exports = {
  // Create Next App put this here
  reactStrictMode: true,
  swcMinify: true,

  // Whitelist profile picture URLs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },

  // Inject "Content-Encoding: gzip" header
  // https://docs.unity3d.com/Manual/webgl-deploying.html
  async headers() {
    return ["build.data.gz", "build.framework.js.gz", "build.wasm.gz"].map(
      (file) => ({
        source: `/build/${file}`,
        headers: [{ key: "Content-Encoding", value: "gzip" }],
      })
    );
  },
};
