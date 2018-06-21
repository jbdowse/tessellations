'use strict';

// Timeline of SVG animations and caption changes

var tessellations = tessellations || {};

tessellations.demo = tessellations.demo || function (index) {
	return tessellations.initDemos(index);
};

tessellations.demo(0).animation = function getDemo0Animation() {

	var unit = {

		isLoaded: false,

		contents: null,

		build: function build() {
			var t = tessellations,
			    pt = t.demo(0).points(),
			    c = t.demo(0).colors(),
			    g = t.geom();

			var a = t.animation().init();

			/* 	 */
			a.caption("Start by drawing a conventional, regular polygon...").show('graphGrid', 0.75) // turn on element & fade it in; add 1 sec to elapsedTime
			.wait(1).show('base', 1).wait(2);

			a.caption("Then, carve out another polygon at the edge of the first polygon, in this instance a triangle...").wait(1).show('carved') // no transition
			.show('rotator') // ditto
			.wait(0.05).hide('base') // turn off w/ no transition
			.to('rotator', ['fill', 'opacity'], [c.rotator, 0.5], 1).wait(3);

			a.caption("Using the bottom left-hand corner as the rotation point, flip the triangle to the side of the first shape...").wait(1.5).to('rotator', 'transform', 'rotate(-90deg)', 1.5).to('rotator', ['fill', 'opacity'], [c.base, 1], 1).show('diamond').wait(0.05).hide('carved').hide('rotator').wait(2);

			a.caption("You've now created your new shape. Now, duplicate it three times, rotate the duplicates, and place them together to create a tiling unit.").wait(1).hide('graphGrid', 1) // fade out 1s, then turn off
			.show('TLTile').to('TLTile', ['fill', 'opacity'], [c.TLTile, 0.5], 1).to('TLTile', 'transform', 'rotate(-90deg)', 1).to('TLTile', 'opacity', 1, 0.75).show('BLTile').to('BLTile', ['fill', 'opacity'], [c.BLTile, 0.5], 1).to('BLTile', 'transform', 'rotate(-180deg)', 1.5).to('BLTile', 'opacity', 1, 0.75).show('BRTile').to('BRTile', ['fill', 'opacity'], [c.BRTile, 0.5], 1).to('BRTile', 'transform', 'rotate(-270deg)', 2).to('BRTile', 'opacity', 1, 0.75).wait(1.25).to('diamond', 'transform', g.shiftTo(-pt.rotX(), -pt.rotY()) + ' rotate(-45deg)', 1).wait(1.5);

			a.caption("Now that you've created a tessellated unit, you can repeat it over and over again to cover an infinite tiled surface.").hide('diamond', 2).rewind(2).show('sq4init', 2).hide(['diamond', 'BRTile', 'BLTile', 'TLTile']) // arrays allowed
			.wait(1).to('sq4init', 'transform', 'scale(1, 1)', 1).rewind(1).show('initPat', 1.5).wait(2);

			a.caption("You can create different tile units with a single irregular shape by applying different color schemes, flipping, or rotating the shapes.").wait(1).hide('initPat', 1.5).rewind(1).to('sq4init', 'transform', g.shiftTo(pt.sq4(0), 0), 1).show('sq2init', 1).wait(0.5).show('mirrorLine', 0.5).wait(0.5).show(['sq2flip', 'sq4flip'], 1).wait(0.5).hide('mirrorLine', 1);

			a.caption("From these four units based on the same shape, you can create dozens of tessellations using a range of replication methods...").wait(3).to('sq4init', 'transform', g.shiftTo(pt.sq3(0), 0), 1).rewind(1).to('sq2init', 'transform', g.shiftTo(pt.sq3(1), 0), 1).rewind(1).to('sq2flip', 'transform', g.shiftTo(pt.sq3(2), 0), 1).rewind(0.75).hide('sq4flip', 1).wait(1);

			a.caption('One such approach is a simple "translation," repeating the unit in the same orientation...').wait(1).show('pats0', 1.5).hide(['sq4init', 'sq2init', 'sq2flip']).wait(4);

			a.caption("Other approaches include rotating or mirroring alternate units, or gliding and staggering them. The possibilities are endless...").hide('pats0', 1.5).rewind(0.1).show('pats1', 1.5).wait(4).hide('pats1', 1.5).rewind(0.1).show('pats2', 1.5).wait(4).hide('pats2', 1.5).rewind(0.1).show('pats3', 1.5).wait(4).hide('pats3', 1.5).rewind(0.25);

			a.caption("All this from a single irregular shape!").on('zoom').to('zoom', ['opacity', 'transform'], [1, g.scaleStr(pt.zoomLarge(), pt.zoomLarge())],
			// wanted rotate(1080deg) but CSS doesn't want to do >360deg rotations
			1.5).wait(3.5).hide('zoom', 1).caption('').end(); // call t.player.end()


			return a;
		}, // end build


		loadOnce: function loadOnce() {
			if (!unit.isLoaded) {
				unit.contents = unit.build();
				unit.isLoaded = true;
			}

			return unit.contents;
		}

	}; // end unit


	return unit.loadOnce;
}(); // end t.demo(0).animation