/**
 * A responsive slider tool in which an image is a draggable / resizable
 * width element which reveals a photo underneath
 *
 * @author Matthew Shelley: mshelley@bynd.com
 */
var RevealSlider = function(params) {

	// Need to apply these vs. dumping on
	this.config = params;

	// Kick it off
	this.init();
}

RevealSlider.prototype = {

	/**
	 * Never go full...
	 */
	transparencyRange: {
		'min': .15,
		'max': .85
	},

	/**
	 * Standard intializer
	 */
	init: function() {
		var me = this,
			before = document.getElementById(me.config['before-container']),
			after = document.getElementById(me.config['after-container']);

		// Hold onto our slider
		me.slider = {
			'element': document.getElementById(me.config.target),
			'handle': document.getElementById(me.config['slider-element'])
		};

		// Hold onto our before element. This is the one we manipulate
		me.before = {
			'element': before,
			'image': before.getElementsByTagName('img')[0]
		};

		// Hold onto our before element. This is the one we manipulate
		me.after = {
			'element': after,
			'image': after.getElementsByTagName('img')[0]
		};

		// Add our events
		me.addEventListeners();

		// Get our ratio
		me._setupRatio();

		// Setup the stage once
		me._setStage();
	},

	/**
	 * Add our event listeners ~ We need to listen to resize
	 */
	addEventListeners: function() {
		var me = this;

		// 1. Document resize, this adds the responsiveness
		window.addEventListener('resize', function(e) {
			me._setStage(e);
		}, false);

		// 2. Touch events || or drag events
		if ('ontouchstart' in document.documentElement) {
			me.mobile = true;
			me.slider.handle.addEventListener('drag', function(e) {
				me._dragEvent(e);
			}, false);
		} else {
			me.slider.handle.addEventListener('drag', function(e) {
				me._dragEvent(e);
			}, false);
		}

		// 3. Image click
		me.slider.element.addEventListener('click', function(e) {
			me._dragEvent(e, true);
		}, false);
	},

	/**
	 * (original height / original width x new width) = new height
	 */
	_setupRatio: function() {
		var me = this,
			currentWidth = me.slider.element.offsetWidth,
			tmp = me.config.ratio.split('/'),
			ratio = {
				width: tmp[0],
				height: tmp[1]
			},
			newHeight = (currentWidth * ratio.height) / ratio.width;

		me.ratio = ratio;
		me._setStage();

		// Position the slider element once
		me.slider.handle.style.left = me.config.start || '50%';
		me.before.element.style.width = me.config.start || '50%';
	},

	/**
	 * We manipulate the image opacity or a colored overlay, this methods takes into account a max / min range
	 *
	 * @param {Interger} percentage ~ The 0 - 100% opacity level
	 */
	_setOpacity: function(percentage) {
		var me = this,
			opacity = parseInt(percentage) / 100;

		if (opacity <= me.transparencyRange.min) {
			opacity = me.transparencyRange.min;
		} else if (opacity >= me.transparencyRange.max) {
			opacity = me.transparencyRange.max;
		}

		document.getElementById('after-overlay').style.opacity = opacity;
		document.getElementById('before-overlay').style.opacity = Math.abs(opacity - 1);
	},

	/**
	 * Update our stage dimensions: This method basically makes this responsive
	 *
	 * @param {Event} e ~ Window Resize event
	 */
	_setStage: function(e) {
		var me = this,
			beforeWidth = me.before.image.offsetWidth,
			currentWidth = me.slider.element.offsetWidth,
			currentHeight = me.slider.element.offsetHeight,
			newHeight = Math.floor((currentWidth * me.ratio.height) / me.ratio.width);

		// Try to minimize this call
		if (currentHeight !== newHeight) {
			me.slider.element.style.height = newHeight + 'px';

			// We must set these values here to get the appear effect
			me.before.image.height = Math.floor(newHeight);
			me.after.image.height = Math.floor(newHeight);
		}
	},

	/**
	 * As we drag we need to hide or reveal the image
	 * We work with percentages to make the reveal stay in position as well images fade in / out as well
	 *
	 * @param {Event} e ~ event object passed in
	 * @param {Boolean} animate ~ Animate should only be passed in when fired by the click event
	 */
	_dragEvent: function(e, animate) {
		var me = this,
			// currentX = (me.mobile) ? e.pageX : e.x,
			// TODO :: Fix for Firefox browser
			currentX = (e.x) ? e.x : e.clientX,

			offsetLeft = me.slider.element.offsetLeft,
			newWidth = currentX - offsetLeft,
			maxWidth = offsetLeft + me.slider.element.offsetWidth,
			singlePercent = me.slider.element.offsetWidth / 100,
			percentWidth = Math.floor(newWidth / singlePercent),
			end = percentWidth;

		// We only use the CSS transistion when we click
		if (animate) {
			me.slider.element.setAttribute('class', 'css-animate');
		} else {
			me.slider.element.setAttribute('class', '');
		}

		// Right when you let go it will fire 0.. thats bad...
		if (currentX !== 0) {
			me._setOpacity(percentWidth);

			// We are dragging within the bounds so we need to update
			if (currentX >= offsetLeft && currentX <= maxWidth) {
				end = percentWidth;
			}

			// Now we are off to a side, fully hidden or revealed
			else {
				// Far left side, show the full before
				if (currentX <= offsetLeft) {
					end = 0;
				}

				// Far right side, show the full after
				else {
					end = 99.9;
				}
			}

			// If we don't pass animate the user is dragging
			if (!animate) {
				me.before.element.style.width = end + '%';
				me.slider.handle.style.left = end + '%';
			} else {
				// Use CSS transistions if available
				if (typeof Modernizr !== 'undefined' && Modernizr.csstransitions) {
					me.before.element.style.width = end + '%';
					me.slider.handle.style.left = end + '%';
					me._setOpacity(end);
				}
				// Timer fallback
				else {
					console.log('We have to use a timeer to animate... IE8 is really, really slow here though...');
					me.animationTimer(end);
				}
			}
		}
	},

	/**
	 * This browser doesn't support CSS transistions so we use a timer
	 *
	 * @param {Interger} value ~ Our ending amount
	 */
	animationTimer: function(value) {
		var me = this,
			percent = parseInt(me.slider.handle.style.left),
			forward = (percent < value) ? true : false,
			delay = 4,
			i = percent;

		// Clear the timer in case the user click multiple times
		clearInterval(me.timer);

		// Now we animate it..
		me.timer = setInterval(function() {
			if (i === value) {
				clearInterval(me.timer);
			}

			me._setOpacity(i);
			me.before.element.style.width = i + '%';
			me.slider.handle.style.left = i + '%';

			(forward) ? i += 1 : i -= 1;

		}, delay);
	}
}