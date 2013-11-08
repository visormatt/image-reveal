module.exports = function(grunt) {

	var me = this,

		// What tasks to run on our scripts
		SCRIPT_SRC = [
			// Any Plugins we may be dependent on first
			'js/src/plugins/modernizr.js',
			'js/src/plugins/eventShim.js',

			// Now for our scripts
			'js/src/image-reveal.js'
		],

		// What tasks to run on our scripts
		SCRIPT_TASKS = [
			'jshint',
			'uglify'
		];

	/**
	 * Project configuration.
	 */
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Watch our files for updates
		 */
		watch: {
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: ['jshint:gruntfile', 'jshint'],
			},

			less: {
				files: ['css/src/*'],
				tasks: ['less']
			},

			options: {
				livereload: true,
			},

			scripts: {
				files: SCRIPT_SRC,
				tasks: SCRIPT_TASKS
			},
		},

		/**
		 * Watch our files for updates
		 */
		less: {
			development: {
				options: {
					paths: ["css/src"]
				},

				files: {
					"css/styles.min.css": "css/src/*.less"
				}
			},

			// production: {
			// 	options: {
			// 		paths: ["css/src"],
			// 		paths: ["assets/css"],
			// 		cleancss: true
			// 	},
			// 	files: {
			// 		"css/styles.min.css": "css/src/*.less"
			// 	}
			// }
		},

		/**
		 * Run this using :: grunt jshint
		 */
		jshint: {
			gruntfile: {
				files: 'Gruntfile.js',
			},

			files: ['js/src/*.js'],

			options: {
				// ignores: ['js/plugins/*.js', 'js/scripts.min.js'],
				// curly: true,
				// eqeqeq: true,
				// eqnull: true,
				// browser: true,
				// globals: {
				// jQuery: true
				// },
			}
		},

		/**
		 * Squash it down and optimize
		 */
		uglify: {
			// production: {
			// },

			// development: {
				// options: {
					// banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					// beautify: true, // Nice formatting
					// compress: false,
					// mangle: false
					// preserveComments: 'all',
				// },
			// },

			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				beautify: false, // Nice formatting
				compress: true,
				mangle: true,
				preserveComments: 'none',
			},

			my_target: {
				files: {
					'js/scripts.min.js': SCRIPT_SRC
				}
			}
		}
	});

	/**
	 * Load our grunt plugins
	 */
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	/**
	 * Default task(s).
	 */
	grunt.registerTask('default', SCRIPT_TASKS);
	grunt.registerTask('production', ['jshint', 'uglify']);

	/**
	 * Any custom tasks we might want
	 *
	 * run using: grunt <task>
	 * ex: grunt production_ready_scripts
	 */
	grunt.registerTask('production_ready_scripts', SCRIPT_TASKS);

	/**
	 * On watch events configure jshint:all to only run on changed file
	 */
	// grunt.event.on('watch', function(action, filepath) {
	// grunt.config('jshint.all.src', filepath);
	// });
};