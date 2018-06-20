// Play/stop etc

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};
	
	
tessellations.load.player = (function loadPlayer()
{
	const t = tessellations;
	
	let loaded = false;
	
	const loadModule = function()
	{
		t.load
		.idTypes()
		.animation();
		

		const _ = {
	
			currentAnimation: null,
			playQueue: [],
			playing: false,
			paused: false,
	
			end: function() {
				_.playing = false;		
				_.playQueue = [];
		
				t.svg('to-start').off();
				t.svg('play').on();
			}
		};
	
	
		t.player = {
		
			currentAnimation: function() { return _.currentAnimation; },
			playQueue: function() { return _.playQueue; },
			setCurrentAnimation: function(animation) { _.currentAnimation = animation; },
			playing: function() { return _.playing && ! _.paused; },
			paused: function() { return _.playing && _.paused; },
			stopped: function() { return ! _.playing; },

			start: function(/*demoIndex*/) { _.playing = true; },
			end: _.end, // used for stop() & at end of demos
			pause: function() { _.paused = true; }, //...
			resume: function() { _.paused = false; }, //...
			
			
			play: function(/*demoIndex*/)
			{
				if (! this.playing() ) {
			
					this.start(/*demoIndex*/);
					this.setCurrentAnimation( t.demo(1 /*demoIndex)*/).animation() );
				
					t.svg('to-start').on();
					t.svg('play').off();
	
					// call setTimeout() for each of the scenes,
					// & store the timeouts in playQueue:
					for (const action of this.currentAnimation().actions() ) {
						this.playQueue().push( action() );
					}
				}
			},
	
	
			stop: function()
			{
				// for some reason "this" doesn't work here though it does at play()
					
				for (const timeout of _.playQueue ) {
					window.clearTimeout(timeout);
				}
		
				for (const shape of _.currentAnimation.animatedElements() ) {
					t.svg(shape).reset();
				}
		
				t.id('caption').html('');
				t.id('demo1-title').html('');
		
				_.end();
			},
			
			
			addListeners: function()
			{
				t.id('play').listen('click', function() { t.player.play(/*1*/); });
				t.id('to-start').listen('click', t.player.stop);
		
				window.addEventListener('keydown', function(k)
				{
					if (k.key === " ") {
						if (t.player.playing()) {
							t.player.stop();
						}
						else {
							t.player.play();
						}
					}
				});

				// eventually need to add listeners for pause/resume, demo 2, home screen, ...

			},
			
		}; // end t.player

	}; // end loadModule
	
	
	return function loadOnce()
	{
		if (! loaded) {
			loadModule();
			loaded = true;
		}
	
		return t.load;
	};
	
	
})();

