module.exports = function(eleventyConfig) {
  return {
    dir: {
      input: "templates",   // Tell Eleventy to use the 'templates' folder as the source
      output: "_site"       // The built site will be output to the '_site' folder
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
