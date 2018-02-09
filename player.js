// Play/stop etc

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};
	
	
tessellations.load.player = function() {

	const t = tessellations;
	
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
			
		play: function(/*demoIndex*/) {
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
	
		stop: function() {
		
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
		}
	};
	
	return t.load;

};
