'use strict';

// Play/stop etc

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};

tessellations.load.player = function loadPlayer() {
	var t = tessellations;

	var loaded = false;

	var loadModule = function loadModule() {
		t.load.idTypes().animation();

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
				if (!this.playing()) {

					this.start();
					this.setCurrentAnimation(t.demo(1 /*demoIndex)*/).animation());

					t.svg('to-start').on();
					t.svg('play').off();

					// call setTimeout() for each of the scenes,
					// & store the timeouts in playQueue:

					for (var _iterator = this.currentAnimation().actions(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
						var _ref;

						if (_isArray) {
							if (_i >= _iterator.length) break;
							_ref = _iterator[_i++];
						} else {
							_i = _iterator.next();
							if (_i.done) break;
							_ref = _i.value;
						}

						var action = _ref;

						this.playQueue().push(action());
					}
				}
			},

			stop: function stop() {
				// for some reason "this" doesn't work here though it does at play()

				for (var _iterator2 = _st.playQueue, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
					var _ref2;

					if (_isArray2) {
						if (_i2 >= _iterator2.length) break;
						_ref2 = _iterator2[_i2++];
					} else {
						_i2 = _iterator2.next();
						if (_i2.done) break;
						_ref2 = _i2.value;
					}

					var timeout = _ref2;

					window.clearTimeout(timeout);
				}

				for (var _iterator3 = _st.currentAnimation.animatedElements(), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
					var _ref3;

					if (_isArray3) {
						if (_i3 >= _iterator3.length) break;
						_ref3 = _iterator3[_i3++];
					} else {
						_i3 = _iterator3.next();
						if (_i3.done) break;
						_ref3 = _i3.value;
					}

					var shape = _ref3;

					t.svg(shape).reset();
				}

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