const path = require("path");

/**
 * Next 14 는 antd, @ant-design/icons 를 쓰는 것만 불러오도록 기본 최적화(optimizePackageImports)되어 있어
 * 13.4 때 넣었던 modularizeImports 설정은 필요 없습니다.
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    additionalData: `@use "sass:map"; @import "utils/_mixins.scss"; @import "utils/_variables.scss";`,
  },
};

module.exports = nextConfig;
