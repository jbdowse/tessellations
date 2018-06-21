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

					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = this.currentAnimation().actions()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var action = _step.value;

							this.playQueue().push(action());
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
					}
				}
			},

			stop: function stop() {
				// for some reason "this" doesn't work here though it does at play()

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = _st.playQueue[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var timeout = _step2.value;

						window.clearTimeout(timeout);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = _st.currentAnimation.animatedElements()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var shape = _step3.value;

						t.svg(shape).reset();
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
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