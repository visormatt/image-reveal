module.exports = function(grunt) {

	/**
	 * Project configuration.
	 */
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'js/*.js',
				dest: 'js/scripts.min.js'
			}
		},

		/**
		 * Watch our files for updates
		 */
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile'],
			},

			options: {
				livereload: true,
			},

			scripts: {
				files: ['js/*.js'],
				tasks: ['jshint'],
				// options: {
				// 	nospawn: true,
				// },
			},
		},

		/**
		 * Run this using :: grunt jshint
		 */
		jshint: {
			// beforeconcat: ['js/image-reveal.js'],
			// afterconcat: ['js/image-reveal.js'],

			files: ['js/*.js'],
			options: {
				ignores: ['js/eventShim.js', 'js/modernizr.js', 'js/scripts.min.js'],
				// curly: true,
				// eqeqeq: true,
				// eqnull: true,
				// browser: true,
				// globals: {
				// jQuery: true
				// },
			}
		}

	});

	/**
	 * Load our plugins
	 */
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	/**
	 * Default task(s).
	 */
	grunt.registerTask('default', ['uglify']);

	/**
	 * On watch events configure jshint:all to only run on changed file
	 */
	grunt.event.on('watch', function(action, filepath) {
		grunt.config('jshint.all.src', filepath);
	});
};