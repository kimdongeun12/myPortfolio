const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    additionalData: `@use "sass:map"; @import "utils/_mixins.scss"; @import "utils/_variables.scss";`,
  },
};

module.exports = nextConfig;
