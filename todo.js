
/* 
	TODO
	- divide build.demo1.styles into sequence of IIFEs just for readability
	- <use> with (xlink:)href defined by JS still doesn't show up in Safari, tho it shows with right value in Safari inspector >:(
	- Write the second demo
	- Write a home screen with buttons for both demos
	- Implement pause/resume, hopefully being able to stick with CSS transitions
		- getComputedValue?
		- also need to clearTimeout on the not-yet-started actions and then re-setTimeout them with correct delay times
	- Implement back-to-start and home buttons
	- Would be really cool to be able to step back and forward within a demo
		- have a progress bar at base with a draggable cursor, like videos
	- Maybe give each svg() element an array of {transProp:..., transDur:...} that can be added to or reduced, which gets csv'd at each change to its style.transitionProperty & style.transitionTime; then could have overlapping transitions of different properties for a single element
		-> see also comments in demo1animation.js
*/

	// as currently written, if tried to have .show('zoom', 1.5).rewind(1.5).to('zoom', 'transform', ..., 1.5),
	// transitionProperty = opacity would get overwritten by = transform
	// so for now keep on() method
/* but (see also TODO in setup.js) want to change this to maybe:
	.show(zoom, 1.5)
	.rewind(1.5)
	.to('zoom', {p:'transform', v:scaleStr(...), t:1.5})
and multiple transitions at once would be e.g.:
	.to('BRTile', [{p: 'fill', v: c.BRTile, t: 0.5}, {p: 'opacity', v: 0.5, t: 0.5}])
- maybe make provision for 3rd overall param to be transTime if all equal
---> OR maybe just write multiple to's in a row:
OR maybe arrays instead of objects for a little more concision:
	.to('BRTile', [['fill', c.BRTile, 0.5], ['opacity', 0.5, 0.5]])
	.to('BRTile', ['transform', 'rotate(-270deg)', 2])
---> OK on further thought, maybe there should be two options:
.to(id/[ids], prop, val, time) - as it currently is for single-property transitions -
OR: .to(id/[ids], [prop1, val1, time1, prop2, val2, time2, ...]) - so that's only ever a single array level
- and this can be easily checked by whether arg2 is an array or not
	- could also use just more top-level args, but not sure about how backwards compatible the ... operator etc is, and [p,v,t,p,v,t] shows pluralness more explicitly

- need updateTransProp/Dur sort of function for getting list of current trans props/durs from array & csv'ing them into style.tP/tD
	- need a way to figure out if a previous transition is done and can be removed from the TP/D list
	- want to be able to do partial changes, e.g. keep opacity transition in an element's list, but change its value and/or time - so you'd have to (1) see if opacity is in the list already and (2) probably just replace it with the new {p,v,t} - so like,

let existingTransition = ar.findByKey(svg(id).transitions(), 'prop', newTransition.prop);
if (existingTransition) {
	existingTransition = newTransition;
}
else {
	svg(id).addTransition(newTransition);
}

ALSO: for eventual progress bar, maybe have animation method .bookmark(bookmarkName) which can be placed wherever you want to be able to step to, and record the states of all animatedShapes (& caption) there during animation construction, and set them to those states when the cue is put at that bookmark; each bookmark could be a little circle along the bar or something, and placed proportional to its time of appearance (record this.elapsedTime() at the bookmark and divide it by ending elapsedTime(), and place the bookmark that fraction along the progress bar); maybe have the cue slide quickly from one bookmark circle to the next at about the same speed as a text change, and probably coordinated with them; maybe include a bookmark for each pattern set though too
	--> ah, maybe the appearance can be just like a 1px horizontal line with small circles, tufteesque
	- there could be step-back & step-forward player buttons; if pressed when playing, the animation would immediately continue playing from the new location; if paused, it would stay paused at the new location
*/
