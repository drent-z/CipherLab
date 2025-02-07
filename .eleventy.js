module.exports = function(eleventyConfig) {
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
