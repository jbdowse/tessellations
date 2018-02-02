/* 
TODO

Miscellaneous:

	- Write the second demo
	- Make a home screen with buttons for both demos
	- Implement back-to-start and home buttons


Pause/resume:

	- Implement pause/resume, hopefully being able to stick with CSS transitions
	- basic steps:
	function setStyleOnPause(id, prop) {
		const currentStyles = window.getComputedStyle(svg(id).element());
		const currentValue = currentStyles.getPropertyValue(prop); 
		svg(id).style(prop, currentValue);
	}

	- also change the transitionDuration of any in-progress transition so its ending time doesn't get delayed

	- also need to clearTimeout on the not-yet-started actions and then re-setTimeout them with correct delay times
		- get timestamp at start: (new Date()).getTime() and again on any pause, then use the difference for new setTimeout times
		- so actions should, instead of current structure where it's just an array of setTimeout functions, probably be an array of {function, absoluteTime},
			and then on each play() from whatever location, all the remaining setTimeouts are called with adjusted times, and their numbers stored in playQueue --> see below under "Timeline bar" too for further thoughts


Timeline bar:

	- make a timeline bar at base of viewport with a draggable cursor, like web videos
		- make animation method .bookmark(bookmarkName) which can be placed in the animation definition wherever you want to be able to step to, and record the states of all animatedShapes (& caption) there during animation construction, and set them to those states when the cue is put at that bookmark
			- also maybe include optional time parameter which specifies any additional wait time desired after resume before animation actually resumes (I guess this would just be for when you go to a bookmark while the player is playing, so that the player keeps playing automatically from the bookmark)

		- each bookmark could appear as a little circle along the bar or something, and placed proportional to its time of appearance (record this.elapsedTime() at the bookmark and divide it by ending elapsedTime(), and place the bookmark circle at that fraction along the progress bar)
		- ah, maybe the appearance can be just like a 1px horizontal line with small circles, tufteesque
		- maybe each bookmark circle should just enlarge at its time, instead of having e.g. a sliding cue shape
	
	- there could be step-back & step-forward player buttons; if pressed when playing, the animation would immediately continue playing from the new location; if paused, it would stay paused at the new location

	- maybe have a preview mini-viewer appear on hover over a bookmark circle that shows a scaled-down version of the state of the demo at that point, as YouTube does when hovering (or just dragging?) over the progress bar
		- SVG-wise, this could be a single scaled-down copy of the demo-view <g> which would be translated to underneath whichever bookmark circle was being hovered under, and its child elements would have states equal to the main-view elements' states at that bookmark - note they'd need different ids, maybe just prefixed with "preview-" or something

	- Overall, it might make sense for the set of states (as mentioned for bookmark() above) to be the fundamental data structure of an animation, rather than an array of functions & times; this would be:
	 	- an array of times
	 	- each time has an associated array of ids with state changing at that time
		- each id has an associated array of properties that are changing at that time

		- Not sure whether for transitions it makes sense to have the beginning and ending state included at their respective times, or whether the transition time should just be included at the start of the transition
		- think I like having both start & end states included at their respective times, to allow e.g. possibly jumping to any point in the animation, not just bookmarks, but then it's a bit more confusing for instantaneous changes; but maybe they could just be flagged with something that indicates a jump at that time, so that any calculation of a state before them uses the previous value; or maybe they should just have a really quick transition
			- this is basically setting up tweening
			- would be nice if this allowed the transProps/Durs to be set a bit earlier than just before the transitions themselves, and then the transitions could have their full time instead of a very slightly reduced time, which might make interpolation more straightforward


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

	- Make time parameter in animation().to() optional, as it is in show() & hide(), and if unspecified, the change is instant
	- Make another subroutine besides transition(), maybe just change() or something, that sets transProp/Dur to 0 and changes the property instantly to the new value, and call it from to/show/hide when time arg is excluded or less than transition delay time



Copied in from ../tessnotes.txt:

Tessellations notes from 171212
- Possible librarifications:
	- Constructing SVG tessellations
		- Ways to create shapes that fit with copies of themselves as tessellations
		- Isometries on those shapes that construct the tessellations, abstracting making sure the distances are right for the shape size, etc.
		- Base shape/block position/rotation etc, extent of copies in whatever direction(s), or alternatively specify a clipping boundary to be filled in completely
	- Animating SVG elements with CSS transitions
		- Using the contours (sets of timelines of property changes) & actions objects (list of timeouts, built from contours) to allow stepping to any point in an animation
		- Flexible player setup incl. arbitrary buttons to e.g. start different animations, though prob provide default button/progress bar/etc appearances
	- Note that both would probably rely upon the svg() module
	- These could be properties of a single library, split into multiple files
	- Eventually: interactive tessellation construction - build your own unit shape & extend with isometries; if desktop/mobile app could save as SVG - check to see if there are any tiling/tessellation apps around already
	
171221 todo:
- check thru Karen's latest emails for items & put here
- make play & stop buttons into play & back-to-start buttons, moved down to lower left, with SVG (or Unicode) symbols with Unicode fallback if SVG, and with title text
- text should be probably in ems with different sizes for different @media, test out on phone vs desktop - need to learn about @media
	- think it may just be a way to specify different behavior for different screen widths? not sure tho
	- in any case, want to just be able to have the page gracefully transition between different widths
- also buttons should be below text, make it so that they don't overlap and that the number of text lines doesn't change the button position
- increase accessibility, see ARIA docs linked by KV
	- look up how to use Google accessibility extension - already installed but haven't figure out how to use it
		- KV responded on how to use it, see emails
- make iframe for KV linking, put credits outside of iframe
- make page background white --> or --> maybe make the iframe white (encompassing just the animation/player/text) and keep the rest of the page gray

180122 notes
For librarification:
- want to include setting up player in a really flexible way
	 - assign id'd html elements to play/pause/etc functions onclick but allow user to choose the particular ids, e.g.
		libname(?).setPlayButton(id-str);
		or
		libname(?).setControls({
			play: (play button id str),
			pause: (pause button id str, might be same as play button),
			etc etc
		});

- of course would be good to look at popular libs like jquery, React, Angular, Vue, etc. to make sure these libraries would work with them without conflict
- would like to be able to load the libraries with proper dependency order (e.g. both animation & tessellation rely on basic svg lib) similar to current setup.js
	- might want a require()/import() sort of thing but would probably want it to be independent of require()s of other libraries
		- could use ES6 import/export maybe? not sure how reliant one should be on ES6 for small libraries???

- 180131 dependency note: need shape defpoints to be available to multiple modules: tiling module, animation module, etc. - maybe it should be a core module and defpoints can be shared as JSON or etc???
	- MAYBE there's not really too much to tiling beyond the basic point/shape construction, transformation, etc, so maybe the tiling module should be the core module, and then the animation module depends on it; OR I wonder if some animation functions could be independent of the tiling/construction module, e.g. if you just wanted to animate SVG shapes independently defined, without needing the construction & transformation functions? and then you would use the tiling module only if you needed it? oh, maybe the defpoints/def-coords JSON could just be an interchange format between the two and the only interaction between them? hmm, think might still want transformation functions from tiling module in the animation module tho...
	- one particular isometry fn that would be useful is a general 2-distinct-points to 2-distinct-points mapping, with option to reflect or not; I think that would handle all isometries, and in some cases it would be more convenient than figuring out fixed points/lines

- API note: remember the initial state (CSS etc) of properties of shapes in an animation that change during the animation should be set at the beginning of the animation score
- is there some way to work with Sass/Less etc for DRY w/r/t CSS definitions? (or a need to?)
- lib name note: looks like tilings.js is available per goog - but not "tiling" singular - and singular is best avoided anyway because it can be interpreted as a gerund for e.g. making a tiled webpage layout 

- think for interoperability with jQuery etc. it would be good if there were some way to for the id & svg methods to work on regular, unwrapped DOM elements, and be chainable...
	- or maybe they could take either id-strings OR DOM elements/groups??? e.g. tilings.svg('circle') or tilings.svg($('circle'))??? hmmmmmmmmm --> ah remember that jQuery $(...) produces a jQuery object, so jQuery wraps the DOM too; maybe id() should be internal and only svg() part of API? 
		- think that probably makes sense; note jQuery objects can be unwrapped via $('xyz')[n] or $('xyz').get(n), or an array of DOM elements from $('xyz').get()
	- if animation module requires construction module, that might simplify dependency structure since I think svg() would be needed for both construction & animation - so construction could just contain the svg() definitions

- possible future step is adding more interactivity (e.g. triggering some sort of animation by clicking on an SVG element with the properties of the animation depending on the location of the click), though that might be achievable by just making the animation/score/player functionality sufficiently generic

- note Tweene http://tweene.com/, an existing animation-timeline library

180128
Thinking about selection/setup/playing of multiple animations on one page:
	- let user assign string names to each animation e.g. "tess1", "tess2",
	then selection buttons/links would listen for e.g. ...play("tess1"), ...play("tess2")

180130
OK so going through the existing code, what should be private and what should be part of the API, and of which module?
- let's call the overall object tilings and call the modules build & animate, and assume build contains the basic svg() code, and that animate depends on build, and calling the existing overall object tess:

Private to tilings.build:
tess.arrays
tess.buildType
tess.id
tess.geom (probably)
tess.load (the shape-construction parts)?

tilings.build API:
tess.svg
tess.geom (possibly)
probably adapted parts of demo(1).points, demo(1).shapes, demo(1).styles
probably adapted parts of demo(1) buildPattern, buildPatternSet

Private to tilings.animate:
probably some functions of tess.player
tess.load (the animation parts)?
probably parts of tess.animation or its eventual successor

tilings.animate API:
probably some functions of tess.player
probably parts of tess.animation or its eventual successor

*/
