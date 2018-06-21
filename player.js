'use strict';

// Play/stop etc

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};

tessellations.load.player = function loadPlayer() {
	var t = tessellations;

	var loaded = false;

	var loadModule = function loadModule() {
		t.load.arrays().idTypes().animation();

		var ar = t.arrays;

		var _st = { // "state"

			currentAnimation: null,
			playQueue: [],
			playing: false,
			paused: false,

			// keeping function() in case use (this) instead of _st
			end: function end() {
				_st.playing = false;
				_st.playQueue = [];

				t.svg('to-start').off();
				t.svg('play').on();
			}
		};

		t.player = {

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
					this.setCurrentAnimation(t.demo(1 /*demoIndex)*/).animation());

					t.svg('to-start').on();
					t.svg('play').off();

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
					t.svg(shape).reset();
				});

				t.id('caption').html('');
				t.id('demo1-title').html('');

				_st.end();
			},

			addListeners: function addListeners() {
				t.id('play').listen('click', function () {
					t.player.play();
				} /*1*/);

				t.id('to-start').listen('click', t.player.stop);

				window.addEventListener('keydown', function (k) {
					if (k.key === " ") {
						if (t.player.playing()) {
							t.player.stop();
						} else {
							t.player.play();
						}
					}
				});

				// eventually need to add listeners for pause/resume, demo 2, home screen, ...
			}

		}; // end t.player
	}; // end loadModule


	return function loadOnce() {
		if (!loaded) {
			loadModule();
			loaded = true;
		}

		return t.load;
	};
}();