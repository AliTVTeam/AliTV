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
							'd3/test/spec/testing_loadKaryo.js', 'd3/test/spec/testing_karyoToCoords.js', 'd3/test/spec/testing_loadLinks.js',
							'd3/test/spec/testing_svgElements.js'
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
				basic: {
					src: ['d3/src/drawingStuff.js', 'd3/src/drawLinks_linear.js', 'd3/src/karyoToCoords_linear.js',
						'd3/src/getRibbon.js', 'd3/src/LinksToCoords_linear.js', 'd3/src/loadKaryo.js',
						'd3/src/loadLinks.js', 'd3/src/drawKaryo_linear.js'
					],
					dest: 'd3/js/wgaPipeline_linear.js',
				},
				extras: {
					src: ['d3/src/loadKaryo.js', 'd3/src/karyoToCoords_circular.js', 'd3/src/drawKaryo.js', 'd3/src/drawingStuff.js',
						'd3/src/loadLinks.js', 'd3/src/LinksToCoords_circular.js', 'd3/src/drawLinks_circular.js',
						'd3/src/drawKaryo_circular.js'
					],
					dest: 'd3/js/wgaPipeline_circular.js',
				}
			},
			jsdoc: {
				dist: {
					src: ['d3/src/*.js'],
					options: {
						destination: 'd3/doc'
					}
				}
			},
			coveralls: {
				options: {
					// LCOV coverage file relevant to every target
					src: 'd3/test/coverage/lcov.info',
					force: false
				}
			}
		});

	// Load the plugins that provides the different tasks.
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('grunt-istanbul-coverage');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-coveralls');

	// Default task(s).
	grunt.registerTask('default', ['make', 'test']);

	grunt
		.registerTask('make', ['jsbeautifier:default', 'concat', 'jsdoc']);

	grunt
		.registerTask('test', ['jsbeautifier:verify', 'jshint', 'jasmine']);

	grunt
		.registerTask('travis', ['jsbeautifier:verify', 'jshint',
			'jasmine', 'coveralls'
		]);

};