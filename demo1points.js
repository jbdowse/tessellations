// Definitions for points used in shape definitions & transformations

var tessellations = tessellations || {};
tessellations.build = tessellations.build || {};
tessellations.build.demo1 = tessellations.build.demo1 || {};


tessellations.initializeDemos = function()
{
	const t = tessellations;

	const _demos = [{}, {}];
	
	t.demo = function(n) {
		return _demos[n - 1];
	};
};


tessellations.build.demo1.all = function()
{
	tessellations.build.demo1
	.points()
	.shapes()
	.patterns()
	.styles()
	.animation();
};

	
tessellations.build.demo1.points = (function buildDemo1Points()
{
	const t = tessellations;
	
	let built = false;
	
	
	const buildComponent = function()
	{

		const _SquarePoints = function(rad) {
	
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
				BR: [_end, _end],		
			};
		};


		// points/counts/lengths for initial-construction shapes;
		const _shp = (function shpIIFE() {
	
			const s = _SquarePoints(64);

			s.gridSubdivs = 4;
			s.gridCell = s.length/s.gridSubdivs;
			s.btmBump = [0, s.end - s.gridCell]; // bottom bump-in
			s.leftBump = [s.start - s.gridCell, 0]; // left bumpout
	
			return s;

		})();


		// points/counts for pattern squares:
		const _sq = (function sqIIFE() {
	
			const s = _SquarePoints(32);
	
			const _bump = s.length/8;
	
			s.TLBump = [s.start + _bump, -_bump];
			s.TRBump = [_bump, s.start + _bump];
			s.BRBump = [s.end - _bump, _bump];
			s.scaleUp = _shp.length/s.length * Math.sqrt(2);
	
			return s;

		})();


		// other values for patterns:
		const _pat = (function patIIFE() {
	
			const _sqsPerSide = 3;
			const _gutter = 16;
	
			return {
				gutter: _gutter, // px
				sqsPerSide: _sqsPerSide,
				shift: _sq.length * _sqsPerSide + _gutter,
			};
	
		})();


		// positions offset by 0.5px for lines:
		const _line = (function lineIIFE() {
	
			const _offset = 0.5;
			const _gridStart = _shp.start + _offset;
			const _gridEnd = _shp.end + _offset;
	
			return {
				cx: _offset,
				cy: _offset,
				gridTL: [_gridStart, _gridStart],
				gridTR: [_gridEnd, _gridStart],
				gridBL: [_gridStart, _gridEnd],
			};
	
		})();
	
	
		t.demo(1).points = {

			// for shapes/squares/patterns:

			center: function() { return _shp.center; },

			shpTL: function() { return _shp.TL; },
			shpBL: function() { return _shp.BL; },
			shpBR: function() { return _shp.BR; },
			shpBtmBump: function() { return _shp.btmBump; },
			shpLeftBump: function() { return _shp.leftBump; },
			gridSubdivs: function() { return _shp.gridSubdivs; },
			gridCell: function() { return _shp.gridCell; },

			sqTL: function() { return _sq.TL; },
			sqTR: function() { return _sq.TR; },
			sqBR: function() { return _sq.BR; },
			sqTLBump: function() { return _sq.TLBump; },
			sqTRBump: function() { return _sq.TRBump; },
			sqBRBump: function() { return _sq.BRBump; },
			sqLength: function() { return _sq.length; },

			lineCx: function() { return _line.cx; },
			lineCy: function() { return _line.cy; },
			gridTL: function() { return _line.gridTL; },
			gridTR: function() { return _line.gridTR; },
			gridBL: function() { return _line.gridBL; },

			sqsPerSide: function() { return _pat.sqsPerSide; },
			patShift: function() { return _pat.shift; },

			// accessors/functions for transforms:

			rotX: function() { return _shp.start; },
			rotY: function() { return _shp.end; },
			sqScaleUp: function() { return _sq.scaleUp; },
			zoomSmall: function() { return 1/64; },
			zoomLarge: function() { return 2; },

			sq4: function(n) {
				const zero_dist = -3 * _sq.length;
				const unit_dist = 2 * _sq.length;
				return zero_dist + n * unit_dist;
			},

			sq3: function(n) {
				const zero_dist = -_pat.shift;
				return zero_dist + n * _pat.shift;
			},
		};
	
	}; // end buildComponent

	
	return function buildOnce()
	{
		if (! built) {
			buildComponent();
			built = true;
		}
	
		return t.build.demo1;
	};
	
})(); // end t.build.demo1.points
