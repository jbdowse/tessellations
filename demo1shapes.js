'use strict';

// Defining the initial-construction shapes

var tessellations = tessellations || {};
tessellations.build = tessellations.build || {};
tessellations.build.demo1 = tessellations.build.demo1 || {};

tessellations.build.demo1.shapes = function buildDemo1Shapes() {
	var t = tessellations;

	var built = false;

	var buildComponent = function buildComponent() {

		t.load.idTypes().geom();

		t.initializeDemos();

		t.build.demo1.points();

		var svg = t.svg,
		    pt = t.demo(1).points,
		    g = t.geom;

		// labels + scope blocks instead of IIFEs:

		buildGraphGrid: {

			g.line('gridlineHoriz', pt.gridTL(), pt.gridTR());
			g.line('gridlineVert', pt.gridTL(), pt.gridBL());

			var gridCell = pt.gridCell();

			for (var i = 0; i <= pt.gridSubdivs(); ++i) {

				svg('graphGrid').defineAnon('use', ['href', '#gridlineHoriz', 'x', 0, 'y', i * gridCell]).defineAnon('use', ['href', '#gridlineVert', 'x', i * gridCell, 'y', 0]);
			}
		}

		buildMirrorLine: {

			var radius = 2 * pt.sqLength();
			var offsetX = pt.lineCx();
			var offsetY = pt.lineCy();
			var lineStartY = -radius + offsetY;
			var lineEndY = radius + offsetY;

			g.line('mirrorLine', [offsetX, lineStartY], [offsetX, lineEndY]);
		}

		definePolygonPoints: {

			g.points('base', [pt.shpTL(), pt.shpBL(), pt.shpBR()]);

			g.points('carved', [pt.shpTL(), pt.shpBL(), pt.shpBtmBump(), pt.shpBR()]);

			g.points('rotator', [pt.shpBL(), pt.shpBtmBump(), pt.shpBR()]);

			g.points('tile', [pt.shpTL(), pt.shpLeftBump(), pt.shpBL(), pt.shpBtmBump(), pt.shpBR()]);

			g.points('singleTile', [pt.sqTL(), pt.sqTLBump(), pt.center(), pt.sqTRBump(), pt.sqTR()]);

			g.points('doubleTile', [pt.sqTL(), pt.sqTLBump(), pt.sqBRBump(), pt.sqBR(), pt.sqTR()]);
		}
	}; // end buildComponent


	return function buildOnce() {
		if (!built) {
			buildComponent();
			built = true;
		}

		return t.build.demo1;
	};
}(); // end t.build.demo1.shapes


tessellations.build.demo1.styles = function buildDemo1Styles() {
	var t = tessellations;

	var built = false;

	var buildComponent = function buildComponent() {

		t.load.arrays().idTypes().geom();

		t.initializeDemos();

		t.build.demo1.points().shapes().patterns();

		t.demo(1).colors = {
			base: '#36c',
			rotator: '#c3c',
			TLTile: '#3c6',
			BLTile: '#fc0',
			BRTile: '#f36'
		};

		var ar = t.arrays,
		    svg = t.svg,
		    pt = t.demo(1).points,
		    c = t.demo(1).colors,
		    scaleStr = t.geom.scaleStr;

		t.id('caption').style('transitionTimingFunction', 'linear');

		hideAll: {

			var allAnimatedShapes = ['graphGrid', 'base', 'carved', 'rotator', 'diamond', 'TLTile', 'BLTile', 'BRTile', 'initPat', 'sq4init', 'sq4flip', 'sq2init', 'sq2flip', 'mirrorLine', 'pats0', 'pats1', 'pats2', 'pats3', 'zoom'];

			ar.forEachOf(allAnimatedShapes, function (id) {
				svg(id).initStyle('display', 'none').initStyle('opacity', 0);
			});
		}

		setBaseColor: {

			var baseColorShapes = ['base', 'carved', 'rotator', 'initTile', 'TLTile', 'BLTile', 'BRTile', 'zoom'];

			ar.forEachOf(baseColorShapes, function (id) {
				svg(id).initStyle('fill', c.base);
			});
		}

		setRotationPoint: {

			var BLRotators = ['rotator', 'diamond', 'TLTile', 'BLTile', 'BRTile'];

			ar.forEachOf(BLRotators, function (id) {
				var origin = t.geom.pxPt(pt.shpBL());
				svg(id).initStyle('transformOrigin', origin);
			});
		}

		setSquarePositions: {

			var laterSquares = ['sq2init', 'sq2flip', 'sq4flip'];

			for (var i = 0; i < laterSquares.length; ++i) {
				var xpos = pt.sq4(i + 1);
				svg(laterSquares[i]).initStyle('transform', t.geom.shiftTo(xpos, 0));
			}
		}

		setInitialScales: {

			svg('sq4init').initStyle('transform', scaleStr(pt.sqScaleUp(), pt.sqScaleUp()));

			svg('zoom').initStyle('transform', scaleStr(pt.zoomSmall(), pt.zoomSmall()));
		}
	}; // end buildComponent


	return function buildOnce() {
		if (!built) {
			buildComponent();
			built = true;
		}

		return t.build.demo1;
	};
}(); // end t.build.demo1.styles