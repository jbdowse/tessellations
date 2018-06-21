// Set up JS-defined SVGs, add event listeners

/* Loose-aggregration-module setup - order of js file reading shouldn't matter -
	 construction order is specified by the setup function below */

// Load/construct all data structures once all files have been read
window.addEventListener('load', function fullSetup()
{
	const t = tessellations;
	
	t.load.allModules();
	t.initializeDemos();
	t.build.demo1.all();
	t.player.addListeners();
});