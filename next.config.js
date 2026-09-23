const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "public/styles")],
    additionalData: `@import "utile/_mixins.scss"; @import "utile/_variables.scss";`,
  },
};

module.exports = nextConfig;
