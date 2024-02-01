module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    watch: {
      css: {
        files: "**/*.css",
        tasks: ["postcss"],
      },
      html: {
        files: "src/index.html",
        tasks: ["htmlmin"],
      },
      svg: {
        files: "src/assets/images/*.svg",
        tasks: ["svgmin"],
      },
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: {
          "dist/index.html": "src/index.html",
        },
      },
    },

    svgmin: {
      options: {
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                sortAttrs: false,
              },
            },
          },
        ],
      },
      dist: {
        files: {
          "dist/assets/images/trademark-logo.svg":
            "src/assets/images/trademark-logo.svg",
        },
      },
    },

    postcss: {
      options: {
        map: {
          inline: false,
          annotation: "dist/assets/css/maps/",
        },

        processors: [require("autoprefixer")(), require("cssnano")()],
      },
      dist: {
        src: "src/style.css",
        dest: "dist/style.min.css",
      },
    },
  });

  grunt.loadNpmTasks("@lodder/grunt-postcss");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-svgmin");

  grunt.registerTask("default", ["svgmin"]);
};
