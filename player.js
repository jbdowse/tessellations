'use strict';

// Play/stop etc

var tessellations = function playerModule(t) {

	var _getPlayer = function _getPlayer() {

		var ds = t.ds(),
		    id = t.idTypes().id(),
		    svg = t.idTypes().svg();

		var _st = { // "state"
			currentAnimation: null,
			playQueue: [],
			isPlaying: false,
			isPaused: false
		};

		var playerBase = ds.accessors(_st);

		var playerExtensions = {

			// using => wherever (this) not used --> which should be everywhere...

			setCurrentAnimation: function setCurrentAnimation(animation) {
				_st.currentAnimation = animation;
			},

			isPlaying: function isPlaying() {
				return _st.isPlaying && !_st.isPaused;
			},

			isPaused: function isPaused() {
				return _st.isPlaying && _st.isPaused;
			},

			isStopped: function isStopped() {
				return !_st.isPlaying;
			},

			start: function start() /*demoIndex*/{
				_st.isPlaying = true;
			},

			pause: function pause() {
				_st.isPaused = true;
			}, //...

			resume: function resume() {
				_st.isPaused = false;
			}, //...

			end: function end() {
				_st.isPlaying = false;
				_st.playQueue = [];

				svg('to-start').off();
				svg('play').on();
			},

			// pretty surprised that these references to const player work even before it's introduced, but they do! hmm
			play: function play() /*demoIndex*/{
				if (!player.isPlaying()) {

					player.start();
					player.setCurrentAnimation(t.demo(0 /*demoIndex)*/).animation());

					svg('to-start').on();
					svg('play').off();

					// call setTimeout() for each of the scenes,
					// & store the timeouts in playQueue:

					ds.forEachOf(player.currentAnimation().actions(), function (action) {
						player.playQueue().push(action());
					});
				}
			},

			stop: function stop() {
				ds.forEachOf(player.playQueue(), function (timeout) {
					window.clearTimeout(timeout);
				});

				ds.forEachOf(player.currentAnimation().animatedElements(), function (shape) {
					svg(shape).reset();
				});

				id('caption').html('');
				id('demo0-title').html('');

				player.end();
			},

			addListeners: function addListeners() {
				id('play').listen('click', function () {
					player.play();
				} /*0*/);

				id('to-start').listen('click', player.stop);

				window.addEventListener('keydown', function (k) {
					if (k.key === " ") {
						if (player.isPlaying()) {
							player.stop();
						} else {
							player.play();
						}
					}
				});

				// eventually need to add listeners for pause/resume, demo 1, home screen, ...
			}

		}; // end playerExtensions


		var player = ds.copyProps([playerBase, playerExtensions]);

		return player;
	}; // end _getPlayer

	t.player = function () {
		return t.loadOnce(_getPlayer);
	};

	return t;
}(tessellations || {});