module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy the assets folder (from the project root) to the output directory
  eleventyConfig.addPassthroughCopy("assets");
  
  // Watch for changes to assets
  eleventyConfig.addWatchTarget("./assets/");
  
  // BrowserSync configuration for better dev experience
  eleventyConfig.setBrowserSyncConfig({
    open: true,
    port: 8080,
    ui: false,
    ghostMode: false
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
    dataTemplateEngine: "njk"
  };
};
