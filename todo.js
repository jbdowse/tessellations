/* 
TODO

Miscellaneous:

	- Write the second demo
	- Make a home screen with buttons for both demos
	- Implement back-to-start and home buttons


Pause/resume:

	- Implement pause/resume, hopefully being able to stick with CSS transitions
	- basic steps:
	function getStyleOnPause(id, prop) {
		const currentStyles = window.getComputedStyle(svg(id).element());
		const currentValue = currentStyles.getPropertyValue(prop); 
		svg(id).style(prop, currentValue);
	}

	- also change the transitionDuration of any in-progress transition so its ending time doesn't get delayed

	- also need to clearTimeout on the not-yet-started actions and then re-setTimeout them with correct delay times
		- get timestamp at start: (new Date()).getTime() and again on any pause, then use the difference for new setTimeout times
		- so actions should, instead of current structure where it's just an array of setTimeout functions, probably be an array of {function, absoluteTime},
			and then on each play() from whatever location, all the remaining setTimeouts are called with adjusted times, and their numbers stored in playQueue


Timeline bar:

	- make a timeline bar at base of viewport with a draggable cursor, like web videos
		- make animation method .bookmark(bookmarkName) which can be placed in the animation definition wherever you want to be able to step to, and record the states of all animatedShapes (& caption) there during animation construction, and set them to those states when the cue is put at that bookmark
		- each bookmark could be a little circle along the bar or something, and placed proportional to its time of appearance (record this.elapsedTime() at the bookmark and divide it by ending elapsedTime(), and place the bookmark circle at that fraction along the progress bar)
		- ah, maybe the appearance can be just like a 1px horizontal line with small circles, tufteesque
		- maybe each bookmark circle should just enlarge at its time, instead of having e.g. a sliding cue shape
	
	- there could be step-back & step-forward player buttons; if pressed when playing, the animation would immediately continue playing from the new location; if paused, it would stay paused at the new location

	- maybe have a preview mini-viewer appear on hover over a bookmark circle that shows a scaled-down version of the state of the demo at that point, as YouTube does when hovering (or just dragging?) over the progress bar
		- SVG-wise, this could be a single scaled-down copy of the demo-view <g> which would be translated to underneath whichever bookmark circle was being hovered under, and its child elements would have states equal to the main-view elements' states at that bookmark - note they'd need different ids, maybe just prefixed with "preview-" or something


Element transition lists:

	- To allow overlapping transitions of different properties for a single element, give each svg() element an array of {transProp:..., transDur:...} that can be added to or reduced, which gets csv'd at each change to its style.transitionProperty & style.transitionTime

	- think that two options for to() make sense:
		.to(id/[ids], prop, val, time) - as it currently is for single-property transitions -
	OR:
 		.to(id/[ids], [prop1, val1, time1, prop2, val2, time2, ...])
		- so that's only ever a single array level - and this can be easily checked by whether arg2 is an array or not
		- could also use just more top-level args, but not sure about how backwards compatible the ... operator etc is, and [p,v,t,p,v,t] shows pluralness more explicitly

	- need updateTransProp/Dur() sort of function for getting list of current trans props/durs from array & csv'ing them into style.tP/tD
		- need a way to figure out if a previous transition is done and can be removed from the TP/D list
		- want to be able to do partial changes, e.g. keep opacity transition in an element's list, but change its value and/or time - so you'd have to
			(1) see if opacity is in the list already and
			(2) probably just replace it with the new {p,v,t} - so like:
		
			function updateTransition(id, prop) {
				let existingTransition = ar.findByKey(svg(id).transitions(), 'prop', newTransition.prop);
				if (existingTransition) {
					existingTransition = newTransition;
				}
				else {
					svg(id).addTransition(newTransition);
				}
			}
*/
