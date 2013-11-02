# [Javascript Hide & Reveal](http://sandbox.visualmarvel.com/Javascript/Hide_and_Reveal)

[DEMO:](http://sandbox.visualmarvel.com/Javascript/Hide_and_Reveal) A responsive before and after image slider.


## Plugins Used
* [Modernizr](http://modernizr.com/): is a JavaScript library that detects HTML5 and CSS3 features in the user’s browser.
* [EventShim](https://github.com/jwmcpeak/EventShim): EventShim adds support for addEventListener(), removeEventListener(), and standard Event object properties to IE8's event model.


## Browser and Device Support
*** Note: This testing is in progress.... I am working on it though :)

##### Desktop Browsers
* Internet Explorer 8/9/10
* Google Chrome vs. 21+
* Apple Safari 5+
* Mozilla Firefox vs 10+

##### Tablet Devices
* iPad 2/3/Mini
* iOS 6.0+

##### Mobile Devices
* iOS 6.0+


## Example Setup

1. Include the script tag and style tags

		<link href="css/styles.css" rel="stylesheet">
		<script type="text/javascript" src="js/image-reveal.js"></script>


2. Add the markup

		<div id="beyond-slider" class="" style="margin-top: 10px;">
			<!-- Before is what we hide the overflow on creating the reveal effect -->
			<div id="before" class="img before" draggable="true">
				<div id="before-overlay" class="overlay"></div>
				<img src="img/before.png" draggable="true">
			</div>

			<!-- After because IE doesn't support background size -->
			<div id="after" class="img after" draggable="false">
				<div id="after-overlay" class="overlay"></div>
				<img src="img/after.png" draggable="false">
			</div>

			<!-- This is the handle that does it -->
			<div id="handle" class="responsive">
				<a href="#" alt="asd" title="dar"></a>
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
					'target': 'beyond-slider',		// ID of the slider container
				});
			};
		</script>


## Additional Notes
The only real limitation is that we require a fixed ratio the entire time...

