module.exports = function(eleventyConfig) {
  return {
    templateFormats: ["njk", "md", "html"], // Ensure njk files are included
    htmlTemplateEngine: "njk",              // Treat .html files as Nunjucks just in case
    markdownTemplateEngine: "njk",          // Treat Markdown as Nunjucks if needed
    dataTemplateEngine: "njk"               // Use Nunjucks for global data files
  };
};
