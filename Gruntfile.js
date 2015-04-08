module.exports = function(grunt) {

	// Project configuration.
	grunt
		.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			jsbeautifier: {
				"default": {
					src: ["Gruntfile.js", "d3/src/*.js"],
					options: {
						js: {
							indent_with_tabs: true
						}
					}
				},
				"verify": {
					src: ["d3/src/*.js"],
					options: {
						mode: "VERIFY_ONLY",
						js: {
							indent_with_tabs: true
						}
					}

				},
			},
			jasmine: {
				components: {
					src: ['d3/src/*.js'],
					options: {
						'--local-to-remote-url-access': true,
						specs: [
							'd3/test/spec/testing_loadKaryo.js'
						],
						vendor: ['d3/lib/jquery.min.js',
							'd3/lib/d3.v3.min.js',
							'd3/test/lib/jasmine-2.2.0/jasmine-jquery.js'
						],
						template: require('grunt-template-jasmine-istanbul'),
						templateOptions: {
							coverage: 'd3/test/coverage/coverage.json',
							report: {
								type: 'lcov',
								options: {
									dir: 'd3/test/coverage'
								}
							},
							thresholds: {
								lines: 75,
								statements: 75,
								branches: 75,
								functions: 90
							}
						},
						helpers: 'd3/test/lib/helper.js'
							// keepRunner : true
					}
				}
			},
			jshint: {
				options: {
					globals: {
						jQuery: true
					}
				},
				all: ['Gruntfile.js', 'd3/src/*.js',
					'wgaPipeline_jasmine/js/wgaPipeline_circular.js'
				]
			},
			concat: {
				options: {

				},
				dist: {
				      src: ['d3/src/drawingStuff.js', 'd3/src/drawLinks.js', 'd3/src/karyoToCoords.js', 
				            'd3/src/getRibbon.js', 'd3/src/LinksToCoords.js', 'd3/src/loadKaryo.js', 
				            'd3/src/loadLinks.js','d3/src/drawKaryo.js'],
				      dest: 'd3/js/wgaPipelineLinear.js',
				},
			}		
		});

	// Load the plugin that provides the "jasmine" task.
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('grunt-istanbul-coverage');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'jasmine']);

	grunt
		.registerTask('travis', ['jsbeautifier:verify', 'jshint',
			'jasmine'
		]);

};
