module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      components: {
        src: [
          'wgaPipeline_jasmine/src/*.js'
        ],
        options: {
	  '--local-to-remote-url-access' : true,
          specs: [
	    'wgaPipeline_jasmine/spec/testing_loadKaryo.js',
	    'wgaPipeline_jasmine/spec/testing_karyoToCoords.js',
	    'wgaPipeline_jasmine/spec/testing_loadLinks.js',
	    'wgaPipeline_jasmine/spec/testing_LinksToCoords.js',
	    'wgaPipeline_jasmine/spec/testing_getRibbon.js',
	    'wgaPipeline_jasmine/spec/testing_svgElements.js',
	  ],
	  vendor: [
	    'wgaPipeline_jasmine/js/jquery.min.js',
	    'wgaPipeline_jasmine/js/d3.v3.min.js'
	  ],
          //keepRunner : true
          //helpers: 'test/spec/*.js'
        }
      }
    }
  });

  // Load the plugin that provides the "jasmine" task.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jasmine']);

  grunt.registerTask('travis', ['jasmine']);

};


