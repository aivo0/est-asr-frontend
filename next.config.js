const withCSS = require("@zeit/next-css");
//module.exports = withCSS({ distDir: "build" });

const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");

module.exports = withCSS(
  withBundleAnalyzer({
    distDir: "build",
    analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: "static",
        reportFilename: "../bundles/server.html"
      },
      browser: {
        analyzerMode: "static",
        reportFilename: "../bundles/client.html"
      }
    }
  })
);
