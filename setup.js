// Set up JS-defined SVGs, add event listeners

/* Loose-aggregration-module setup - order of js file reading shouldn't matter -
	 construction order is specified by the setup function below */

// Load/construct all data structures once all files have been read
(function setUpPageIIFE() {

	window.addEventListener('load', function onloadIIFE() {
	
		const t = tessellations;
		
		t.load
			.arrays()
			.buildType()
			.idTypes()
			.geom()
			.player()
			.animation();
			
		t.initializeDemos();
	
		t.build.demo1
			.points()
			.shapes()
			.patterns()
			.styles()
			.animation();

		(function addPlayerListenersIIFE() {

			t.id('play').listen('click', function() { t.player.play(/*1*/); });
			t.id('to-start').listen('click', t.player.stop);
			
			window.addEventListener('keydown', function(k) {
				if (k.key === " ") {
					if (t.player.playing()) {
						t.player.stop();
					}
					else {
						t.player.play();
					}
				}
			})

			// eventually need to add listeners for pause/resume, demo 2, home screen, ...

		})();
		
	});

})();
