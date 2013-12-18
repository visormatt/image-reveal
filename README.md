# [Javascript Hide & Reveal](http://visormatt.github.io/image-reveal/)

[DEMO:](http://sandbox.visualmarvel.com/Javascript/Hide_and_Reveal) A responsive before and after image slider.


### Plugins Used
-------------------------------------------
* [Modernizr](http://modernizr.com/): is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.
* [EventShim](https://github.com/jwmcpeak/EventShim): EventShim adds support for addEventListener(), removeEventListener(), and standard Event object properties to IE8's event model.

### Workflow Tools Used
-------------------------------------------
* [Gruntjs](http://gruntjs.com/): In one word: automation.
* [LESS](http://lesscss.org/): LESS extends CSS with dynamic behavior such as variables, mixins, operations and functions.


### Browser and Device Support
-------------------------------------------
*** Note: This testing is in progress.... I am working on it though :)

	Desktop Browsers
	* Internet Explorer 8/9/10
	* Google Chrome vs. 21+
	* Apple Safari 5+
	* Mozilla Firefox vs 10+

	Tablet Devices
	* iPad 2/3/Mini
	* iOS 6.0+

### Example Setup
-------------------------------------------

1. Include the script tag and style tags

		<link href="css/styles.css" rel="stylesheet">
		<script type="text/javascript" src="js/image-reveal.js"></script>


2. Add the markup

		<div id="image-slider" class="" style="margin-top: 10px;">
			<!-- Before is what we hide the overflow on creating the reveal effect -->
			<div id="before" class="img before" draggable="false">
				<div id="before-overlay" class="overlay"></div>
				<img src="img/before.png" draggable="false">
			</div>

			<!-- After because IE doesn't support background size -->
			<div id="after" class="img after" draggable="false">
				<div id="after-overlay" class="overlay"></div>
				<img src="img/after.png" draggable="false">
			</div>

			<!-- This is the handle that does it -->
			<div id="handle" class="responsive">
				<a href="#" alt="" title=""></a>
			</div>
		</div>

3. On Document Ready we want to trigger our Class

		<script language="javascript" type="text/javascript">
			window.onload = function() {
				var slider = new RevealSlider({
					'after-container': 'after',		// ID of the after container
					'before-container': 'before',	// ID of the before containers
					'ratio': '16/9',				// Ratio of the images ~ ex: 4/3 or 19/9
					'slider-element': 'handle',		// ID of the element to attach drag events
					'start': '50%',					// Accepts any starting point in px or %
					'target': 'image-slider',		// ID of the slider container
				});
			};
		</script>


### Local Development Steps & Tools
-------------------------------------------

##### First time installation
For the first time you can read the [Documenation](http://gruntjs.com/getting-started) and then follow the steps below:

1. [Download](http://nodejs.org/) & Install [Nodejs](http://nodejs.org/)
2. Install [Gruntjs](http://gruntjs.com/) by following the steps below.
3. Open terminal and CD into the directory containing this README.md
	* sudo npm install -g grunt-cli
4. Install Project Plugins
	* sudo npm install
5. Run
	* grunt

Now you should see a few things run and ***"Done, without errors."***

##### Local Development
From here on out, just cd CD into the directory containing this README.md and run the following command:

1. Watch
	* grunt watch

We have setup tasks for javascript validation using [Grunt JShint](https://github.com/gruntjs/grunt-contrib-jshint), script concatination via [Grunt Uglify](https://github.com/gruntjs/grunt-contrib-uglify) and less compilation using [Grunt Less](https://github.com/gruntjs/grunt-contrib-less). Running the command above monitors the appropriate folders using [Grunt Watch](https://github.com/gruntjs/grunt-contrib-watch) and runs tasks as a watched document is updated. All of these packages are installed in the first time installation steps.


### Additional Notes
-------------------------------------------
The only real limitation is that we require a fixed ratio the entire time...