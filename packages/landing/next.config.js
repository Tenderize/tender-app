module.exports = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  async redirects() {
    return [
      {
        source: "/tokens",
        destination: "/tokens/grt",
        permanent: true,
      },
    ];
  },
}
