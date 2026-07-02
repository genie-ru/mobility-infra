/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // web(nginx) が /portal/ 以下をこのサービスに渡す。アセットも /portal/_next/... に
  // なるよう basePath を設定（assetPrefix は basePath から自動導出）。
  basePath: '/portal',
};

export default nextConfig;
