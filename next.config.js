const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    additionalData: `@use "sass:map"; @use "sass:math"; @import "utils/_mixins.scss"; @import "utils/_variables.scss";`,
  },
};

module.exports = nextConfig;
