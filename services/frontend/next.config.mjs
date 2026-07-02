/** @type {import('next').NextConfig} */
const nextConfig = {
  // distroless で server.js 単体実行するための最小依存バンドル。
  output: 'standalone',
};

export default nextConfig;
