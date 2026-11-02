const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    additionalData: `@use "sass:map"; @import "utils/_mixins.scss"; @import "utils/_variables.scss";`,
  },
  /**
   * 라이브러리에서 실제로 쓰는 것만 불러오기 (Next 13.4 에는 optimizePackageImports 가 없어 직접 설정)
   * - import { PlusOutlined } from '@ant-design/icons' → '@ant-design/icons/es/icons/PlusOutlined'
   *   (안 하면 아이콘 832개를 전부 컴파일)
   * - import { DatePicker } from 'antd' → 'antd/es/date-picker'
   */
  modularizeImports: {
    "@ant-design/icons": {
      transform: "@ant-design/icons/es/icons/{{member}}",
    },
    antd: {
      transform: "antd/es/{{kebabCase member}}",
    },
  },
};

module.exports = nextConfig;
