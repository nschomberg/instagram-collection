/**
 * This Grunt file is where our tasks are defined
 *
 * TODO add grunt task for running unit tests and add to default flow
 * TODO add grunt task for generating documentation and add to default flow
 */

module.exports = function(grunt) {
	var jsFiles = ['*.js', 'lib/**/*.js', '*.json'];
	grunt.initConfig({
		// Fetch package info in case we want to reuse it down the line
		pkg: grunt.file.readJSON('package.json'),
		// Js linter to catch potential goofs
		jshint: {
			options: {
				esversion: 6, // Use es6 standards
				reporter: require('jshint-stylish'), // Nice formatting
				node: true // Tell the linter to chill out
			},
			// Run this task for all js files (except for our node_modules)
			build: jsFiles
		},
		// Watch will kick off some tasks when my files change
		watch: {
			scripts: {
				files: jsFiles,
				tasks: ['default']
			}
		},
		// Beautifier to keep our files neat and tidy
		"jsbeautifier": {
			files: jsFiles,
			options: {
				"js": {
					break_chained_methods: true,
					indentChar: " ",
					indentLevel: 0,
					indentSize: 2,
					indentWithTabs: true,
					jslint_happy: false,
					space_after_anon_function: false
				},
			}
		}
	});

	// Set up our default task
	grunt.registerTask('default', ['jshint', 'jsbeautifier']);

	// Load up our installed packages
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-jsbeautifier");
};
