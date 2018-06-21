"use strict";

// Definitions for points used in shape definitions & transformations

var tessellations = tessellations || {};

// think/hope this means that t.demo === t.initDemos semantically, just lazy defn for order-independence:
tessellations.demo = tessellations.demo || function (index) {
	return tessellations.initDemos(index);
};

tessellations.initDemos = function () {
	var demos = {

		initialized: false,

		access: null,

		accessInit: function accessInit() {
			var demoData = [{}, {}];
			return function (index) {
				return demoData[index];
			};
		},

		initOnceAndAccess: function initOnceAndAccess(index) {
			if (!demos.initialized) {
				demos.access = demos.accessInit();
				demos.initialized = true;
			}

			return demos.access(index);
		}
	};

	return demos.initOnceAndAccess;
}();

tessellations.demo(0).initSvg = function () {
	tessellations.demo(0).buildShapes().buildPatterns().buildStyles();
};

tessellations.demo(0).points = function getDemo0Points() {
	var unit = {

		built: false,

		contents: null,

		build: function build() {

			var _SquarePoints = function _SquarePoints(rad) {

				var _pts = {
					start: -rad,
					end: rad
				};

				return {
					start: _pts.start,
					end: _pts.end,
					length: 2 * rad,
					center: [0, 0],
					TL: [_pts.start, _pts.start],
					TR: [_pts.end, _pts.start],
					BL: [_pts.start, _pts.end],
					BR: [_pts.end, _pts.end]
				};
			};

			// points/counts/lengths for initial-construction shapes:
			var _shp = function () {
				var s = _SquarePoints(64);

				s.gridSubdivs = 4;
				s.gridCell = s.length / s.gridSubdivs;
				s.btmBump = [0, s.end - s.gridCell]; // bottom bump-in
				s.leftBump = [s.start - s.gridCell, 0]; // left bumpout

				return s;
			}();

			// points/counts for pattern squares:
			var _sq = function () {
				var s = _SquarePoints(32),
				    _bump = s.length / 8;

				s.TLBump = [s.start + _bump, -_bump];
				s.TRBump = [_bump, s.start + _bump];
				s.BRBump = [s.end - _bump, _bump];
				s.scaleUp = _shp.length / s.length * Math.sqrt(2);

				return s;
			}();

			// other values for patterns:
			var _pat = function () {
				var p = {
					sqsPerSide: 3,
					gutter: 16 // px
				};

				p.shift = _sq.length * p.sqsPerSide + p.gutter;

				return p;
			}();

			// positions offset by 0.5px for lines:
			var _line = function () {

				var _offset = 0.5,
				    _gridStart = _shp.start + _offset,
				    _gridEnd = _shp.end + _offset;

				return {
					cx: _offset,
					cy: _offset,
					gridTL: [_gridStart, _gridStart],
					gridTR: [_gridEnd, _gridStart],
					gridBL: [_gridStart, _gridEnd]
				};
			}();

			var points = {

				// for shapes/squares/patterns:

				center: function center() {
					return _shp.center;
				},

				shpTL: function shpTL() {
					return _shp.TL;
				},
				shpBL: function shpBL() {
					return _shp.BL;
				},
				shpBR: function shpBR() {
					return _shp.BR;
				},
				shpBtmBump: function shpBtmBump() {
					return _shp.btmBump;
				},
				shpLeftBump: function shpLeftBump() {
					return _shp.leftBump;
				},
				gridSubdivs: function gridSubdivs() {
					return _shp.gridSubdivs;
				},
				gridCell: function gridCell() {
					return _shp.gridCell;
				},

				sqTL: function sqTL() {
					return _sq.TL;
				},
				sqTR: function sqTR() {
					return _sq.TR;
				},
				sqBR: function sqBR() {
					return _sq.BR;
				},
				sqTLBump: function sqTLBump() {
					return _sq.TLBump;
				},
				sqTRBump: function sqTRBump() {
					return _sq.TRBump;
				},
				sqBRBump: function sqBRBump() {
					return _sq.BRBump;
				},
				sqLength: function sqLength() {
					return _sq.length;
				},

				lineCx: function lineCx() {
					return _line.cx;
				},
				lineCy: function lineCy() {
					return _line.cy;
				},
				gridTL: function gridTL() {
					return _line.gridTL;
				},
				gridTR: function gridTR() {
					return _line.gridTR;
				},
				gridBL: function gridBL() {
					return _line.gridBL;
				},

				sqsPerSide: function sqsPerSide() {
					return _pat.sqsPerSide;
				},
				patShift: function patShift() {
					return _pat.shift;
				},

				// accessors/functions for transforms:

				rotX: function rotX() {
					return _shp.start;
				},
				rotY: function rotY() {
					return _shp.end;
				},
				sqScaleUp: function sqScaleUp() {
					return _sq.scaleUp;
				},
				zoomSmall: function zoomSmall() {
					return 1 / 64;
				},
				zoomLarge: function zoomLarge() {
					return 2;
				},

				sq4: function sq4(n) {
					var zero_dist = -3 * _sq.length,
					    unit_dist = 2 * _sq.length;

					return zero_dist + n * unit_dist;
				},

				sq3: function sq3(n) {
					var zero_dist = -_pat.shift;
					return zero_dist + n * _pat.shift;
				}
			};

			return points;
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
}(); // end t.demo(0).points
