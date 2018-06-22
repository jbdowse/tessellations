'use strict';

// Play/stop etc

var tessellations = function playerModule(t) {

	var _getPlayer = function _getPlayer() {

		var ar = t.arrays(),
		    id = t.idTypes().id(),
		    svg = t.idTypes().svg();

		var _st = { // "state"

			currentAnimation: null,
			playQueue: [],
			playing: false,
			paused: false,

			// keeping function() in case use (this) instead of _st
			end: function end() {
				_st.playing = false;
				_st.playQueue = [];

				svg('to-start').off();
				svg('play').on();
			}
		};

		var player = {

			// using => wherever (this) not used

			currentAnimation: function currentAnimation() {
				return _st.currentAnimation;
			},

			playQueue: function playQueue() {
				return _st.playQueue;
			},

			setCurrentAnimation: function setCurrentAnimation(animation) {
				_st.currentAnimation = animation;
			},

			playing: function playing() {
				return _st.playing && !_st.paused;
			},

			paused: function paused() {
				return _st.playing && _st.paused;
			},

			stopped: function stopped() {
				return !_st.playing;
			},

			start: function start() /*demoIndex*/{
				_st.playing = true;
			},

			end: _st.end, // used for stop() & at end of demos

			pause: function pause() {
				_st.paused = true;
			}, //...

			resume: function resume() {
				_st.paused = false;
			}, //...


			play: function play() /*demoIndex*/{
				var _this = this;

				if (!this.playing()) {

					this.start();
					this.setCurrentAnimation(t.demo(0 /*demoIndex)*/).animation());

					svg('to-start').on();
					svg('play').off();

					// call setTimeout() for each of the scenes,
					// & store the timeouts in playQueue:

					ar.forEachOf(this.currentAnimation().actions(), function (action) {
						_this.playQueue().push(action());
					});
				}
			},

			stop: function stop() {
				// for some reason "this" doesn't work here though it does at play()

				ar.forEachOf(_st.playQueue, function (timeout) {
					window.clearTimeout(timeout);
				});

				ar.forEachOf(_st.currentAnimation.animatedElements(), function (shape) {
					svg(shape).reset();
				});

				id('caption').html('');
				id('demo0-title').html('');

				_st.end();
			},

			addListeners: function addListeners() {
				var _this2 = this;

				id('play').listen('click', function () {
					_this2.play();
				} /*0*/);

				id('to-start').listen('click', this.stop);

				window.addEventListener('keydown', function (k) {
					if (k.key === " ") {
						if (_this2.playing()) {
							_this2.stop();
						} else {
							_this2.play();
						}
					}
				});

				// eventually need to add listeners for pause/resume, demo 1, home screen, ...
			}

		}; // end player


		return player;
	}; // end _getPlayer

	t.player = function () {
		return t.loadOnce(_getPlayer);
	};

	return t;
}(tessellations || {});