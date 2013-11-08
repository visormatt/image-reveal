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
};

RevealSlider.prototype = {

	deviceConfig: {
		isIE: false,
		isMobile: false,
		isSafari: false
	},

	/**
	 * Never go fully to either end of opacity
	 */
	transparencyRange: {
		'min': 0.15,
		'max': 0.85
	},

	/**
	 * Standard intializer
	 */
	init: function() {
		var me = this,
			before = document.getElementById(me.config['before-container']),
			after = document.getElementById(me.config['after-container']);

		// Get device / browser details
		me.userConfiguration();

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

		// Force a click on safari browsers
		me.simulateClick(me.slider.handle);
	},

	/**
	 * We need to know some general information about the users device. These properties control our touch vs. mouse event logic
	 */
	userConfiguration: function() {
		var me = this;

		// Check for mobile / touch events
		if ('ontouchstart' in document.documentElement) {
			me.deviceConfig.mobile = true;
		}

		// Check for safari as we need to initiate a click
		if (navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {
			me.deviceConfig.isSafari = true;
		}

		// Check for IE
		if (navigator.appName.indexOf("Internet Explorer") !== -1) {
			var ieOld = (navigator.appVersion.indexOf("MSIE 9") !== -1) ? 9 : 8,
				ieVersion = (navigator.appVersion.indexOf("MSIE 1") !== -1) ? 10 : ieOld;

			me.deviceConfig.isIE = true;
			me.deviceConfig.ieVersion = ieVersion;
		}
	},

	/**
	 * We have to trigger the first click to ensure all content is fully in place, this was seen on Safari
	 */
	simulateClick: function(element) {
		var me = this,
			clickTarget = parseInt(me.slider.element.offsetLeft) + parseInt( (me.slider.element.offsetWidth / 100) * parseInt(me.config.start) );

		if (!me.deviceConfig.isSafari) {
			return;
		}

		if (document.dispatchEvent) { // W3C
			var oEvent = document.createEvent("MouseEvents");
			oEvent.initMouseEvent("click", true, true, window, 1, clickTarget, 1, clickTarget, 1, false, false, false, false, 0, element);
			element.dispatchEvent(oEvent);
		} else if (document.fireEvent) { // IE
			element.fireEvent("onclick");
		}
	},

	/**
	 * Add our event listeners ~ We need to listen to resize
	 */
	addEventListeners: function() {
		var me = this;

		// 1. Document resize, this adds the responsiveness
		window.addEventListener('resize', function() {
			me._setStage();
		}, false);

		// 2a. Touch events || or drag events
		if (me.deviceConfig.mobile) {
			me.slider.handle.addEventListener('touchstart', function(e) {
				e.preventDefault();
				me.dragEnabled = true;
				me._dragEvent(e);
			}, false);

			me.slider.handle.addEventListener('touchend', function() {
				me.dragEnabled = false;
			}, false);

			document.body.addEventListener('touchmove', function(e) {
				if (me.dragEnabled) {
					me._dragEvent(e);
				}
			}, false);
		}

		// 2b. We are unable to use the drag event as it doesn't update coords on FF so we use mouse events
		else {

			// Has the user started the drag event, on our handle
			me.slider.handle.addEventListener('mousedown', function(e) {
				e.preventDefault();
				me._dragEvent(e);
				me.dragEnabled = true;
			}, false);

			// We attach the body if they scroll outside our element and then release
			document.body.addEventListener('mouseup', function() {
				me.dragEnabled = false;
			}, false);

			// We attach the body if they scroll off our browser window
			document.addEventListener('mouseout', function(e) {
				if (e.target.tagName.toLowerCase() === 'html') {
					me.dragEnabled = false;
				}
			}, false);

			// Lastly we listen for the cursor position if the mouse is still down
			document.body.addEventListener('mousemove', function(e) {
				if (me.dragEnabled) {
					e.preventDefault();
					me._dragEvent(e);
				}
			}, false);
		}

		// 3. Slider Element clicked
		me.slider.element.addEventListener('click', function(e) {
			me._dragEvent(e, true);
		}, false);
	},

	/**
	 * (original height / original width x new width) = new height
	 */
	_setupRatio: function() {
		var me = this,
			tmp = me.config.ratio.split('/'),
			ratio = {
				width: tmp[0],
				height: tmp[1]
			};

		me.ratio = ratio;
		me._setStage();
		me._setOpacity( parseInt(me.config.start) );

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

		// IE8 Opacity hack
		if (me.deviceConfig.ieVersion === 8) {
			document.getElementById('after-overlay').setAttribute('style', '-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (opacity * 100) + ')";');
			document.getElementById('before-overlay').setAttribute('style', '-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + Math.abs((opacity - 1) * 100) + ')";');
		} else {
			document.getElementById('after-overlay').style.opacity = opacity;
			document.getElementById('before-overlay').style.opacity = Math.abs(opacity - 1);
		}
	},

	/**
	 * Update our stage dimensions: This method basically makes this responsive
	 */
	_setStage: function() {
		var me = this,
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
		console.log('E TYPE: ', e.type);

		var me = this,
			browserX = (e.x) ? e.x : e.clientX,
			mobileX = (e.touches && e.touches[0].clientX !== 0) ? e.touches[0].clientX : e.pageX,
			currentX = (me.deviceConfig.mobile) ? mobileX : browserX,
			offsetLeft = me.slider.element.offsetLeft,
			newWidth = currentX - offsetLeft,
			maxWidth = offsetLeft + me.slider.element.offsetWidth,
			singlePercent = me.slider.element.offsetWidth / 100,
			percentWidth = Math.floor(newWidth / singlePercent),
			end = percentWidth,
			ieOffset = (offsetLeft / singlePercent);

		console.log('currentX :: ', currentX);

		// We only use the CSS transistion when we click to animate
		if (animate) {
			me.slider.element.setAttribute('class', 'css-animate');
		} else {
			me.slider.element.setAttribute('class', '');
		}

		// Right when you let go it will fire 0.. thats bad...
		if (currentX !== 0) {
			me._setOpacity(percentWidth);

			// Lovely IE tweaks
			if (me.deviceConfig.isIE) {
				currentX += offsetLeft;
			}

			// We are dragging within the bounds so we need to update
			if (currentX >= offsetLeft && currentX <= maxWidth) {
				end = (me.deviceConfig.isIE) ? percentWidth + ieOffset : percentWidth;
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

				// Timer fallback for browsers that don't support transitions
				else {
					if (me.deviceConfig.isIE && me.deviceConfig.ieVersion !== 8) {
						me.animationTimer(Math.floor(end));
					}

					// IE8 can not process the updates quickly enough
					else {
						me.before.element.style.width = end + '%';
						me.slider.handle.style.left = end + '%';
					}
				}
			}
		}
	},

	/**
	 * This browser doesn't support CSS transistions so we use a timer
	 *
	 * @param {Interger} value ~ Our ending amount 0 - 100
	 */
	animationTimer: function(value) {
		var me = this,
			percent = Math.floor(parseInt(me.slider.handle.style.left)),
			currentPosition = percent,
			forward = (percent < value) ? true : false,
			delay = 5,
			i = currentPosition,
			direction = null;

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
			direction = (forward) ? i += 1 : i -= 1;

		}, delay);
	}
};