module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy the assets folder to the output directory
  eleventyConfig.addPassthroughCopy("assets");
  
  // Watch for changes to assets
  eleventyConfig.addWatchTarget("./assets/");
  
  // Debug information for troubleshooting
  console.log("Eleventy Configuration:");
  console.log("- Input Directory: templates");
  console.log("- Output Directory: _site");
  
  // BrowserSync configuration for better dev experience
  eleventyConfig.setBrowserSyncConfig({
    open: true,
    port: 8080,
    ui: false,
    ghostMode: false,
    server: {
      baseDir: "_site"
    },
    callbacks: {
      ready: function(err, bs) {
        bs.addMiddleware("*", (req, res) => {
          // Handle missing pages and redirect to 404
          const content_404 = "<!DOCTYPE html><html><head><title>404: Page Not Found</title></head><body><h1>404: Page Not Found</h1><p>Sorry, the page you're looking for doesn't exist.</p><a href='/'>Go Home</a></body></html>";
          res.writeHead(404, { "Content-Type": "text/html" });
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: "templates",
      includes: ".",  // Use the root of "templates" as the includes folder
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
