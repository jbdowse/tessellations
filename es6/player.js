// Play/stop etc

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};
	
	
tessellations.load.player = (function loadPlayer()
{
	const t = tessellations;
	
	let loaded = false;
	
	const loadModule = () =>
	{
		t.load
		.arrays()
		.idTypes()
		.animation();
		
		const ar = t.arrays;
		

		const _st = { // "state"
	
			currentAnimation: null,
			playQueue: [],
			playing: false,
			paused: false,
			
			// keeping function() in case use (this) instead of _st
			end: function() {
				_st.playing = false;		
				_st.playQueue = [];
		
				t.svg('to-start').off();
				t.svg('play').on();
			},
		};
	
	
		t.player = {
			
			// using => wherever (this) not used
			
			currentAnimation: () => _st.currentAnimation,
			
			playQueue: () => _st.playQueue,
			
			setCurrentAnimation: animation => { _st.currentAnimation = animation; },
			
			playing: () => _st.playing && ! _st.paused,
			
			paused: () => _st.playing && _st.paused,
			
			stopped: () => ! _st.playing,

			start: (/*demoIndex*/) => { _st.playing = true; },
			
			end: _st.end, // used for stop() & at end of demos
			
			pause: () => { _st.paused = true; }, //...
			
			resume: () => { _st.paused = false; }, //...
			
			
			play: function(/*demoIndex*/)
			{
				if (! this.playing() ) {
			
					this.start(/*demoIndex*/);
					this.setCurrentAnimation( t.demo(1 /*demoIndex)*/).animation() );
				
					t.svg('to-start').on();
					t.svg('play').off();
	
					// call setTimeout() for each of the scenes,
					// & store the timeouts in playQueue:
					
					ar.forEachOf(this.currentAnimation().actions(), action =>
					{
						this.playQueue().push( action() );
					});
				}
			},
	
	
			stop: function()
			{
				// for some reason "this" doesn't work here though it does at play()
					
				ar.forEachOf(_st.playQueue, timeout =>
				{
					window.clearTimeout(timeout);
				});
		
				ar.forEachOf(_st.currentAnimation.animatedElements(), shape =>
				{
					t.svg(shape).reset();
				});
		
				t.id('caption').html('');
				t.id('demo1-title').html('');
		
				_st.end();
			},
			
			
			addListeners: function()
			{
				t.id('play').listen('click', () => {
					t.player.play(/*1*/);
				});
				
				t.id('to-start').listen('click', t.player.stop);
		
				window.addEventListener('keydown', k =>
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

