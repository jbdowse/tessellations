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

180206
thinking about immutability via Object.defineProperty() options:
- make it easy to make objects/"namespaces" fully immutable
- but also make it easy to make extendable "namespaces" and sub-namespaces
	where all their non-namespace contents are fully immutable, but namespaces
	can gain new properties
	- but: also allow "closing" of namespaces to prevent further extension
		- maybe provide option to close just the set of the namespace's own children
		(i.e. its properties) but let its sub-namespaces remain extendable;
		- vs. option to close the parent namespace and all its sub-namespaces at the same time
- note that deep freeze doesn't work on cyclic reference graphs
- think it makes sense to keep SVG etc. elements that change over time as mutable
	since that's simpler to implement and reflects their behavior

example:

(assuming t = tilings)

var(?) demo1 = demo! || t.ns(); // make namespace

demo1.points = t.ns();

const _SquarePoints = t.fn(function(rad) { // make non-redefinable function

	const _start = -rad;
	const _end = rad;

	return {
		start: _start,
		end: _end,
		length: 2*rad,
		center: [0, 0],
		TL: [_start, _start],
		TR: [_end, _start],
		BL: [_start, _end],
		BR: [_end, _end]		
	};
});

const _shp = demo1.points.shp = t.rec(function shpIIFE() { // make non-extendable record

	const s = _SquarePoints(64);

	s.gridSubdivs = 4;
	s.gridCell = s.length/s.gridSubdivs;
	s.btmBump = [0, s.end - s.gridCell]; // bottom bump-in
	s.leftBump = [s.start - s.gridCell, 0]; // left bumpout

	return s;

}());

const _sq = demo1.points.sq = t.rec(function sqIIFE() {

	const s = _SquarePoints(32);

	const _bump = s.length/8;

	s.TLBump = [s.start + _bump, -_bump];
	s.TRBump = [_bump, s.start + _bump];
	s.BRBump = [s.end - _bump, _bump];
	s.scaleUp = _shp.length/s.length * Math.sqrt(2);

	return s;

}());

demo1.points.pat = t.rec(function patIIFE() {

	const _sqsPerSide = 3;
	const _gutter = 16;

	return {
		sqsPerSide: _sqsPerSide,
		shift: _sq.length * _sqsPerSide + _gutter
	};

}());

demo1.points.line = t.rec(function lineIIFE() {

	const _offset = 0.5;
	const _gridStart = _shp.start + _offset;
	const _gridEnd = _shp.end + _offset;

	return {
		cx: _offset,
		cy: _offset,
		gridTL: [_gridStart, _gridStart],
		gridTR: [_gridEnd, _gridStart],
		gridBL: [_gridStart, _gridEnd]
	};

})();

demo1.points.rot = t.rec({
	x: _shp.start,
	y: _shp.end
});

demo1.points.zoom = t.rec(
	small: 1/64,
	large: 2
)

demo1.points.sq4 = t.fn(function(n) {
	const zero_dist = -3 * _sq.length;
	const unit_dist = 2 * _sq.length;
	return zero_dist + n * unit_dist;
});

demo1.points.sq3 = t.fn(function(n) {
	const zero_dist = -_pat.shift;
	return zero_dist + n * _pat.shift;
});

// alternative to the last few items:

t.add(demo1.points, {
	rot: {
		x: _shp.start,
		y: _shp.end
	},
	zoom: {
		small: 1/64,
		large: 2
	},
	sq4: function(n) {
		const zero_dist = -3 * _sq.length;
		const unit_dist = 2 * _sq.length;
		return zero_dist + n * unit_dist;
	},
	sq3: function(n) {
		const zero_dist = -_pat.shift;
		return zero_dist + n * _pat.shift;
	}
}); // all these are automatically deep-immutable;
	// probably should have to declare sub-namespaces separately

t.close(demo1.points);

-----------

further geometry construction thoughts:
- in addition to 2-point isometry/scale, (or 3-point affine),
	for simple scaling/moving, have an option to provide a start point,
	the corresponding output point, and the scale factor;
	could also extend this to rotations with i/o points, scale factor, and angle of rotation

want to step through the process of defining the shapes of demo1, maybe in plain English
to start, to help figure out an API that would make it as easy as possible:

- a square centered vert & horiz in player window, some specific width/height
- gridlines dividing the square in quarter pieces (so 5 gridlines in each direction)
- base = triangle of TL, BL, BR points of square
- bump defpoints: one at (x center, 1/4 of square up from bottom of square);
	the other = the first rotated 90˚ccw around square's BL corner = shape-rotator-point
- rotator = triangle of BL, bump1, BR
- carved = base \ triangle
- shape = TL bump2 BL bump1 BR = (rotate (rotator, 90˚ccw around shape-rotator-point)) | carved
	^ provide for defining a transformation of (90˚ccw around shape-rotator-point)
	since it's used for both bump2 and rotator rotation and:
- shapeTL = shape to start; eventual transformn = 90srp
- shapeBL = " ; " = 180srp
- shapeBR = " ; " = 270srp
- diamond = group(shape, shapeTL, shapeBL, shapeBR)
- transform diamond:
	1. rotate it 45˚ccw while moving srp to window-center
	2. eventually scale it down to the tiling-size
--> maybe transform-by-points could have args ([ip1, op1], [ip2, op2], [ip3, op3]) (2 & 3 optional)
	and for any of the points, if i is same as o, just have a single point value instead of an array
	- maybe for clarity, e.g. ({i: [ip1x,ip1y], o: [op1x,op1y]}, [fp2x,fp2y]) (fp = fixed point)
- basic tiling: 3x3 grid of small squares, initial one centered on window-center
- set of 4 squares: in horizontal line, equally spaced, group centered on window-center
	- on-center spacing of ends = two * on-center of patterns, which is (pattern-width + gutter)
	- sq 1 = init tile
	- sq 2 = (shape0 | shape90), (shape180 | shape270)
	- sq 3 = flipH(sq 2)
	- sq 4 = flipH(sq 1)
- mirror line: vertical, centered on window-center, a specific height
- set of 3 squares: same end positions as sqs-4, but with sq 3 moving to R end and sq 2 moving to middle; sq 1 stays fixed
- patterns: 3 in a row, same centers as sqs-3
	- 4 sets of patterns defined by generators as currently
		- except want to make sure the various rotations/flips for indiv tiles are easy to do
		(center stays fixed when apply flip or rotation)
- zoom: same shape as original shape; scale starts at specific value, ends at a larger specific value;
	shape centered on window-center the whole time

Now to script the above in a desired API:
--> note: think about ACAD commands

w = t.window('player'); // associates to #player in DOM
cp = w.center();
sqSide = 64;
gridSq = w.square(sqSide, cp) -- ah how about square({s: sqSide, c: cp})
	- could also have e.g. square({BL: ..., top: ...}) etc.
gridlineH = w.line(gridSq.TL, gridSq.TR)
gridH = w.array(gridlineH, {e: mv(0,sqSide), n: 4}) // alt: {s: mv(...), n: 4}; e = end, s = step, n = num of addl copies
grid = w.group(gridH, rotate(gridH, 90, cp));
--> alt via chaining:
grid = gridSq
	.line(<-.TL, <-.TR)
	.array({mv(0, sqSide), n: 4})
	.groupWith(<-.rotate(90, cp));
roPt = gridSq.BL;
base = gridSq.polygon(<-.TL, roPt, <-.BR);
bump1 = gridSq.point(0, 1/2); // relative to gridSq center; L & T = -1, R & B = 1
ro = t.rotate(90, roPt);
bump2 = ro(bump1);
rotator = w.polygon(roPt, bump1, gridSq.BR);
carved = base.minus(rotator);
shape = rotator.apply(ro).plus(base);
	// note need apply in place vs. apply to make copy; may need this for all transformations
	// - think better to make the copy version the basic one (functional style), and in-place explicit
ro2 = ro.times(2);
ro3 = ro.times(3); // <--- these get used in the animation, so they should be properties of an object,
	as should any other variables that are used in the animation
diamond = shape.groupWithCopies(4); // accessible maybe by diamond.get(0), ..., diamond.get(3)
diamondRotation = t.trans({i: roPt, o: cp, ro: 45});
tileSide = 32;
diamondScale = t.scale(tileSide/sqSide * Math.sqrt(2), cp);
tilingTemplate = w.tile([3,3], cp);
	// will have to think much more about
	possible params of .tile, e.g. what if they're hexagonal or triangular;
	what if you want to fill their container in some or all directions
	rather than fill a certain number; what if you want an irregularly-bounded set of tiles
gutter = 24;
sqLeft = cp.mv(-(tilingTemplate.width() + gutter), 0);
sqRight = sqLeft.flip(mv);
sqs4 = w.array({b: sqLeft, e: sqRight, n: 3});
sqs3 = w.array([sqLeft, cp, sqRight]);
// --> think there needs to be an easy way to assign classes &/ ids to
	DOM (SVG) elements corresponding to tilings objects - in order to e.g.
	give correct fill colors to shapes, e.g.:
sq4 = diamond.apply([diamondRotation, diamondScale]);
sq4.get([0, 2]).attr('.light');
sq4.get([1, 3]).attr('.dark');
sq2 = w.group(t.union(sq4.get(0), sq4.get(1)), t.union(sq4.get(2), sq4.get(3)));
sq2flip = sq2.flipH(cp);
sq4flip = sq4.flipH(cp);
// --> also need to make sure that these constructions intelligently
	make <defs> vs <use> vs plain SVG elements depending on their use
	- or maybe that should be explicitly controlled by the user

180207
- note that functions can have properties assigned to them,
e.g.:
function f(x) {return x * x;}
f.exp = 2;
- presumably something like this is how you can have both jQuery(arg).method1() and jQuery.method2()
think it makes sense to use a jQ-like syntax for getting elements:

const t = tilings;
const cp = t('player').center();
const sqSide = 64;
// aha for things like gridSq, it might be useful for them to be able to be simple
// mathematical objects, rather than e.g. elements of <defs>/<symbol>
const gridSq = t.def('square', {s: sqSide, c: cp});
// .def relating to defpoints; although this might make user think it's being added to <defs>
// ^ again, make gridSq a property of a persistent object if needed in the animation or elsewhere
// ^ ah, call these guides instead; could have: t.guide, t.defs (t.symbol?), t.draw with sub-properties:
const gridSq = t.guide.sq({s: sqSide, c: cp});
// aha note the <pattern> SVG element for tiling
// note: use <title> tags on SVG elements to increase accessibility

180208
- grids: are such a commonly needed kind of guide that it definitely
	makes sense to include them; possible or required params:
	o: origin point
	minX, maxX, minY, maxY, min (includes both x & y), max (ditto)
	^ should the units of these be grid positions or 
		- all of these are optional; where excluded, the grid extends to edge of container
	unitX, unitY: length of grid cell in px
	countX, countY: number of cells
	angleX, angleY: angle of x & y lines; default x = 0, y = 90 (or -90?)
	slopeX, slopeY: alternative to angles in (standard y)/(standard x) slope; maybe not able to express vertical line this way unless can use null or similar
 
- maybe use this syntax to differentiate guides from DOM elements:
	t.grid(...) is a guide;
	t('base').grid('baseGrid', {...}) is an SVG object - grids would be depicted by sets of lines - detect edge of container for indefinite grids - probably use <symbol> or <defs> for gridline defn and <use> for the copies

- guides can maybe be lazy, or at least grids could be - actually grids could just be structs with spacing & extents properties - no need for them to enumerate their constituent points/lines
- ^ guides are just simple numerical objects
- ^ possibly include corresponding guide data into SVG element wrappers, BUT this may well not be necessary assuming there are accessible SVG DOM properties with any geometry data needed
- guides should be immutable; transformations of guides yield new guides
- guide lines should be able to be segments, rays, or lines:
	- segments: define by endpoints or by 1 endpoint + angle + length or relative x,y change, or thru-points plus distance of endpoints from either one (actually thru-points could lie on extension of segment, not necessarily segment itself); or by thru-point & xmin/xmax &/ ymin/ymax where possible
	- rays: define by endpoint & a thru-point, or endpoint + angle or slope, or thru-point + distance to endpoint + slope/angle, or 2 thru-points + endpoint x or y, etc.
	- lines: define by thru-point + angle/slope or by 2 thru-points
- maybe t.xing(line1, line2) = (for non-parallel segments/rays/lines line, line2) intersection point of (infinite) lines containing line1 & line2; if line1 & line2 are parallel, incl. if they're collinear, maybe return null & console.log a warning

so then e.g.:

const cp = t('player').center(); // returns a guide point
const gridU = 32;
t('player').grid('grid', {o: cp, min: -2, max: 2, u: gridU});
	// min & max as single numbers mean minX = minY = -2; could also have e.g. min: [-2, -1] meaning minX = -2, minY = -1
	// here, can also use t('grid') like a guide - just in this case it's also associated to a DOM element
const roPt = t('grid').BL();
const bumpIn = t('grid').pt(0, 1);
	// could also have Grid.lineX(n) & .lineY(n) to get lines out of grids
const bumpOut = bumpIn.rotate(roPt, 90); // could also use t('grid').pt(-3, 0)
	^ bumpOut defn may not really be needed
t('player').pgon('base', [t('grid').TL(), roPt, t('grid').BR()]);
t('player').pgon('rotator', [roPt, bumpIn, t('grid').BR()]);
t('player').pgon('carved', ) \\
	// aha, could define plines BL-TL-TR, BL-bumpIn-TR, BL-TR then use them to define base, carved, rotator:
const TL = t('player').TL();
const BR = t('player').BR();
const topPline = t.pline([roPt, TL, BR]);
const midPline = t.pline([roPt, bumpIn, BR]);
const btmPline = t.pline([roPt, BR]);
t('player').pgonFromPlines('base', [topPline, btmPline]);
t('player').pgonFromPlines('carved', [topPline, midPline]);
t('player').pgonFromPlines('rotator', [midPline, btmPline]);
// maybe consolidate the above:
t.iterate(
	t('player').pgonFromPlines,
	[
		['base', [topPline, btmPline]],
		['carved', [topPline, midPline]],
		['rotator', [midPline, btmPline]]
	]
);
// hmm what about making t('shape')? would still be useful to have union for that
// but on a quick glance it looks like boolean ops are complex to implement, so probably
	skip that and stick with flexible line/intersection ops
t('player').pgon('shape', [TL, bumpOut, roPt, bumpIn, BR]);
// now note that if polygon#shape is already in the markup, just without point defns, could have e.g.:
t('shape').setPts([TL, bumpOut, ...]);

180611
various ideas for librarification etc:

- provide lattices as a way to help define tilings etc
	- a lattice could probably be repd as a closure/method which has basis properties (base point, u vector, v vector, or etc) and computes a point location given u,v coordinate args
	- provide flexible object-param way to initialize a lattice - would be useful for creating certain kinds, e.g. an equilateral-triangular or square lattice is definable just by a base point and a single vector, or two distinct neighboring points, etc

- want to, if possible, provide ways to make tilings of a given wallpaper group
	- e.g. given a set of shapes and a wallpaper group of a given lattice, copy the shapes to make the tiling, like the site that (I think) Karen sent link to
		- but it would be nice to, unlike that site, make it easy to make neat well-behaved tilings, i.e. ones following the usual vertex/edge/face rules

- for tilings, want easy ways to define boundaries of the tilings, as I think considered earlier
	- e.g. clip at boundary vs. tiles on boundary fully included vs. tiles on boundary excluded

- want to make it easy for equivalent-by-translation animations to be applied to each corresponding tile of a tiling (or a selection of tiles), e.g. each tile simultaneously rotating 90˚ccw around its top left corner
*/
