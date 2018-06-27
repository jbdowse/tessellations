// Play/stop etc

var tessellations = (function playerModule(t)
{

	const _getPlayer = () => {
		
		const
			ds = t.ds(),
			id = t.idTypes().id(),
			svg = t.idTypes().svg();
	

		const _st = { // "state"
			currentAnimation: null,
			playQueue: [],
			isPlaying: false,
			isPaused: false,
		};
		
		
		const playerBase = ds.accessors(_st);


		const playerExtensions = {
		
			// using => wherever (this) not used --> which should be everywhere...
		
			setCurrentAnimation: animation => { _st.currentAnimation = animation; },
		
			isPlaying: () => _st.isPlaying && ! _st.isPaused,
		
			isPaused: () => _st.isPlaying && _st.isPaused,
		
			isStopped: () => ! _st.isPlaying,

			start: (/*demoIndex*/) => { _st.isPlaying = true; },
			
			pause: () => { _st.isPaused = true; }, //...
		
			resume: () => { _st.isPaused = false; }, //...
		
			end: () => 
			{
				_st.isPlaying = false;		
				_st.playQueue = [];
	
				svg('to-start').off();
				svg('play').on();
			},
		
			// pretty surprised that these references to const player work even before it's introduced, but they do! hmm
			play: function(/*demoIndex*/)
			{
				if (! player.isPlaying() ) {
		
					player.start(/*demoIndex*/);
					player.setCurrentAnimation( t.demo(0 /*demoIndex)*/).animation() );
			
					svg('to-start').on();
					svg('play').off();

					// call setTimeout() for each of the scenes,
					// & store the timeouts in playQueue:
				
					ds.forEachOf(player.currentAnimation().actions(), action =>
					{
						player.playQueue().push( action() );
					});
				}
			},


			stop: function()
			{
				ds.forEachOf(player.playQueue(), timeout =>
				{
					window.clearTimeout(timeout);
				});
	
				ds.forEachOf(player.currentAnimation().animatedElements(), shape =>
				{
					svg(shape).reset();
				});
	
				id('caption').html('');
				id('demo0-title').html('');
	
				player.end();
			},
		
		
			addListeners: function()
			{
				id('play').listen('click', () => {
					player.play(/*0*/);
				});
			
				id('to-start').listen('click', player.stop);
	
				window.addEventListener('keydown', k =>
				{
					if (k.key === " ") {
						if (player.isPlaying()) {
							player.stop();
						}
						else {
							player.play();
						}
					}
				});

				// eventually need to add listeners for pause/resume, demo 1, home screen, ...
			},
		
		}; // end playerExtensions
		
		
		const player = ds.copyProps([playerBase, playerExtensions]);
		
		
		return player;

	}; // end _getPlayer
	
	t.player = () => t.loadOnce(_getPlayer);

	
	return t;
	
})(tessellations || {});
