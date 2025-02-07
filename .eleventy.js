module.exports = function(eleventyConfig) {
  // Tell Eleventy to copy the assets folder (from the project root) to the output directory
  eleventyConfig.addPassthroughCopy("assets");

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
