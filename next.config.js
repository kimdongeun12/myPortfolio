const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    additionalData: `@use "sass:map"; @import "utils/_mixins.scss"; @import "utils/_variables.scss";`,
  },
  // 어드민 배포(Vercel 의 admin 프로젝트, 환경변수 ADMIN_SITE=true)에서는 첫 화면을 /admin 으로 보냄
  async redirects() {
    if (process.env.ADMIN_SITE !== "true") return [];
    return [{ source: "/", destination: "/admin", permanent: false }];
  },
};

module.exports = nextConfig;
