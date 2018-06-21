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

		t.load.idTypes().geom();

		t.initializeDemos();

		t.build.demo1.points().shapes().patterns();

		t.demo(1).colors = {
			base: '#36c',
			rotator: '#c3c',
			TLTile: '#3c6',
			BLTile: '#fc0',
			BRTile: '#f36'
		};

		var svg = t.svg,
		    pt = t.demo(1).points,
		    c = t.demo(1).colors,
		    scaleStr = t.geom.scaleStr;

		t.id('caption').style('transitionTimingFunction', 'linear');

		hideAll: {

			var allAnimatedShapes = ['graphGrid', 'base', 'carved', 'rotator', 'diamond', 'TLTile', 'BLTile', 'BRTile', 'initPat', 'sq4init', 'sq4flip', 'sq2init', 'sq2flip', 'mirrorLine', 'pats0', 'pats1', 'pats2', 'pats3', 'zoom'];

			for (var _iterator = allAnimatedShapes, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var id = _ref;

				svg(id).initStyle('display', 'none').initStyle('opacity', 0);
			}
		}

		setBaseColor: {

			var baseColorShapes = ['base', 'carved', 'rotator', 'initTile', 'TLTile', 'BLTile', 'BRTile', 'zoom'];

			for (var _iterator2 = baseColorShapes, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var _id = _ref2;

				svg(_id).initStyle('fill', c.base);
			}
		}

		setRotationPoint: {

			var BLRotators = ['rotator', 'diamond', 'TLTile', 'BLTile', 'BRTile'];

			for (var _iterator3 = BLRotators, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
				var _ref3;

				if (_isArray3) {
					if (_i3 >= _iterator3.length) break;
					_ref3 = _iterator3[_i3++];
				} else {
					_i3 = _iterator3.next();
					if (_i3.done) break;
					_ref3 = _i3.value;
				}

				var _id2 = _ref3;

				var origin = t.geom.pxPt(pt.shpBL());
				svg(_id2).initStyle('transformOrigin', origin);
			}
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