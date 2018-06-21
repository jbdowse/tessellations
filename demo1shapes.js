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

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = allAnimatedShapes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var id = _step.value;

					svg(id).initStyle('display', 'none').initStyle('opacity', 0);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}

		setBaseColor: {

			var baseColorShapes = ['base', 'carved', 'rotator', 'initTile', 'TLTile', 'BLTile', 'BRTile', 'zoom'];

			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = baseColorShapes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var _id = _step2.value;

					svg(_id).initStyle('fill', c.base);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}

		setRotationPoint: {

			var BLRotators = ['rotator', 'diamond', 'TLTile', 'BLTile', 'BRTile'];

			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = BLRotators[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _id2 = _step3.value;

					var origin = t.geom.pxPt(pt.shpBL());
					svg(_id2).initStyle('transformOrigin', origin);
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
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