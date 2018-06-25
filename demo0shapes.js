'use strict';

// Defining the initial-construction shapes

var tessellations = function demo0shapesModule(t) {

	t.demo = t.demo || function () {
		var _demos = [];
		return function (index) {
			return _demos[index] = _demos[index] || {};
		};
	}();

	// note this and the other _do...'s are command- rather than data-functions, because they're just modifying DOM elements

	var _doBuildShapes = function _doBuildShapes() {

		var ds = t.ds(),
		    svg = t.idTypes().svg(),
		    pt = t.demo(0).points(),
		    g = t.geom();

		var _build = {

			graphGrid: function graphGrid() {
				g.line('gridlineHoriz', pt.gridTL(), pt.gridTR());
				g.line('gridlineVert', pt.gridTL(), pt.gridBL());

				var gridCell = pt.gridCell(),
				    lineCount = pt.gridSubdivs() + 1;

				ds.forCount(lineCount, function (i) {

					svg('graphGrid').defineAnon('use', ['href', '#gridlineHoriz', 'x', 0, 'y', i * gridCell]).defineAnon('use', ['href', '#gridlineVert', 'x', i * gridCell, 'y', 0]);
				});

				return _build;
			},

			mirrorLine: function mirrorLine() {
				var radius = 2 * pt.sqLength(),
				    offsetX = pt.lineCx(),
				    offsetY = pt.lineCy(),
				    lineStartY = -radius + offsetY,
				    lineEndY = radius + offsetY;

				g.line('mirrorLine', [offsetX, lineStartY], [offsetX, lineEndY]);

				return _build;
			},

			polygonPoints: function polygonPoints() {
				g.points('base', [pt.shpTL(), pt.shpBL(), pt.shpBR()]);

				g.points('carved', [pt.shpTL(), pt.shpBL(), pt.shpBtmBump(), pt.shpBR()]);

				g.points('rotator', [pt.shpBL(), pt.shpBtmBump(), pt.shpBR()]);

				g.points('tile', [pt.shpTL(), pt.shpLeftBump(), pt.shpBL(), pt.shpBtmBump(), pt.shpBR()]);

				g.points('singleTile', [pt.sqTL(), pt.sqTLBump(), pt.center(), pt.sqTRBump(), pt.sqTR()]);

				g.points('doubleTile', [pt.sqTL(), pt.sqTLBump(), pt.sqBRBump(), pt.sqBR(), pt.sqTR()]);

				return _build;
			},

			allShapes: function allShapes() {
				_build.graphGrid().mirrorLine().polygonPoints();

				return _build;
			}

		}; // end _build


		_build.allShapes();

		return t.demo(0);
	}; // end _doBuildShapes

	t.demo(0).buildShapes = function () {
		return t.loadOnce(_doBuildShapes);
	};

	/* this doesn't really need the full loading infrastructure
 but keeping it in case it gains the need for lazy loading: */

	var _getDemo0Colors = function _getDemo0Colors() {
		var colors = {
			base: '#36c',
			rotator: '#c3c',
			TLTile: '#3c6',
			BLTile: '#fc0',
			BRTile: '#f36'
		};

		var accessors = t.ds().accessors(colors);

		return accessors;
	};

	t.demo(0).colors = function () {
		return t.loadOnce(_getDemo0Colors);
	};

	var _doBuildStyles = function _doBuildStyles() {

		var ds = t.ds(),
		    getId = t.idTypes().id(),
		    // distinguish from many id params below
		svg = t.idTypes().svg(),
		    geom = t.geom(),
		    pt = t.demo(0).points(),
		    c = t.demo(0).colors();

		t.demo(0).buildShapes().buildPatterns();

		var _init = {

			setCaptionTiming: function setCaptionTiming() {
				getId('caption').style('transitionTimingFunction', 'linear');
				return _init;
			},

			hideAll: function hideAll() {
				var allAnimatedShapes = ['graphGrid', 'base', 'carved', 'rotator', 'diamond', 'TLTile', 'BLTile', 'BRTile', 'initPat', 'sq4init', 'sq4flip', 'sq2init', 'sq2flip', 'mirrorLine', 'pats0', 'pats1', 'pats2', 'pats3', 'zoom'];

				ds.forEachOf(allAnimatedShapes, function (id) {
					svg(id).initStyle('display', 'none').initStyle('opacity', 0);
				});

				return _init;
			},

			setBaseColor: function setBaseColor() {
				var baseColorShapes = ['base', 'carved', 'rotator', 'initTile', 'TLTile', 'BLTile', 'BRTile', 'zoom'];

				ds.forEachOf(baseColorShapes, function (id) {
					svg(id).initStyle('fill', c.base());
				});

				return _init;
			},

			setRotationPoint: function setRotationPoint() {
				var BLRotators = ['rotator', 'diamond', 'TLTile', 'BLTile', 'BRTile'];

				ds.forEachOf(BLRotators, function (id) {
					var origin = geom.pxPt(pt.shpBL());
					svg(id).initStyle('transformOrigin', origin);
				});

				return _init;
			},

			setSquarePositions: function setSquarePositions() {
				var laterSquares = ['sq2init', 'sq2flip', 'sq4flip'];

				ds.forCount(laterSquares.length, function (i) {
					var xpos = pt.sq4(i + 1);
					svg(laterSquares[i]).initStyle('transform', geom.shiftTo(xpos, 0));
				});

				return _init;
			},

			setInitialScales: function setInitialScales() {
				svg('sq4init').initStyle('transform', geom.scaleStr(pt.sqScaleUp(), pt.sqScaleUp()));

				svg('zoom').initStyle('transform', geom.scaleStr(pt.zoomSmall(), pt.zoomSmall()));

				return _init;
			},

			allStyles: function allStyles() {
				_init.hideAll().setCaptionTiming().setBaseColor().setRotationPoint().setSquarePositions().setInitialScales();

				return _init;
			}

		}; // end _init


		_init.allStyles();

		return t.demo(0);
	}; // end _doBuildStyles

	t.demo(0).buildStyles = function () {
		return t.loadOnce(_doBuildStyles);
	};

	return t;
}(tessellations || {});