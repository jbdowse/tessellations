// Play/stop etc

var tessellations = tessellations || {};


tessellations.player = (function getPlayer()
{
	
	const unit = {
		
		isLoaded: false,
		
		contents: null,
		
		
		build: () => {
			
			const
				t = tessellations,
				ar = t.arrays(),
				id = t.idTypes().id(),
				svg = t.idTypes().svg();
		

			const _st = { // "state"
	
				currentAnimation: null,
				playQueue: [],
				playing: false,
				paused: false,
			
				// keeping function() in case use (this) instead of _st
				end: function() {
					_st.playing = false;		
					_st.playQueue = [];
		
					svg('to-start').off();
					svg('play').on();
				},
			};
	
	
			const player = {
			
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
						this.setCurrentAnimation( t.demo(0 /*demoIndex)*/).animation() );
				
						svg('to-start').on();
						svg('play').off();
	
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
						svg(shape).reset();
					});
		
					id('caption').html('');
					id('demo0-title').html('');
		
					_st.end();
				},
			
			
				addListeners: function()
				{
					id('play').listen('click', () => {
						this.play(/*0*/);
					});
				
					id('to-start').listen('click', this.stop);
		
					window.addEventListener('keydown', k =>
					{
						if (k.key === " ") {
							if (this.playing()) {
								this.stop();
							}
							else {
								this.play();
							}
						}
					});

					// eventually need to add listeners for pause/resume, demo 1, home screen, ...

				},
			
			}; // end player
			
			
			return player;

		}, // end build
		
		
		loadOnce: () =>
		{
			if (! unit.isLoaded) {
				unit.contents = unit.build();
				unit.isLoaded = true;
			}
			
			return unit.contents;
		},
		
	}; // end unit
	
	
	return unit.loadOnce;
	
})();
