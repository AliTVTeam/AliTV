module.exports = function(grunt) {

	// Project configuration.
	grunt
		.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			jsbeautifier: {
				"default": {
					src: ["Gruntfile.js", "d3/src/*.js",
						"d3/js/wgaPipeline.js"
					],
					options: {
						js: {
							indent_with_tabs: true
						}
					}
				},
				"verify": {
					src: ["Gruntfile.js", "d3/src/*.js",
						"d3/js/wgaPipeline.js"
					],
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
					src: ['d3/js/wgaPipeline.js'],
					options: {
						'--local-to-remote-url-access': true,
						specs: ['d3/test/spec/test_*.js'],
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
				all: ['Gruntfile.js', 'd3/js/wgaPipeline.js']
			},
			jsdoc: {
				dist: {
					src: ['d3/js/wgaPipeline.js'],
					options: {
						destination: 'd3/doc'
					}
				}
			},
			coveralls: {
				all: {
					// LCOV coverage file relevant to every target
					src: 'd3/test/coverage/lcov.info',
					options: {
						force: false
					}
				}
			}
		});

	// Load the plugins that provides the different tasks.
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-jsbeautifier");
	grunt.loadNpmTasks('grunt-istanbul-coverage');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-coveralls');

	// Default task(s).
	grunt.registerTask('default', ['make', 'test']);

	grunt.registerTask('make', ['jsbeautifier:default', 'jsdoc']);

	grunt.registerTask('test', ['jsbeautifier:verify', 'jshint', 'jasmine']);

	grunt.registerTask('travis', ['jsbeautifier:verify', 'jshint', 'jasmine',
		'coveralls'
	]);

};
