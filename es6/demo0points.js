// Definitions for points used in shape definitions & transformations

var tessellations = tessellations || {};

// think/hope this means that t.demo === t.initDemos semantically, just lazy defn for order-independence:
tessellations.demo = tessellations.demo ||
	(index => tessellations.initDemos(index));



tessellations.initDemos = (() =>
{
	const demos = {
		
		initialized: false,
		
		access: null,
		
		accessInit: () =>
		{
			const demoData = [];
			
			return index =>
			{
				if (demoData[index] === undefined) {
					demoData[index] = {};
				}
				
				return demoData[index];
			};
		},
		
		initOnceAndAccess: index =>
		{
			if (! demos.initialized) {
				demos.access = demos.accessInit();
				demos.initialized = true;
			}
			
			return demos.access(index);
		},
	};
	
	return demos.initOnceAndAccess;
	
})();



tessellations.demo(0).initSvg = () =>
{
	tessellations.demo(0)
		.buildShapes()
		.buildPatterns()
		.buildStyles();
};

	
tessellations.demo(0).points = (function getDemo0Points()
{
	const unit = {
		
		built: false,
		
		contents: null,


		build: () => 
		{

			const _SquarePoints = rad => {
			
				const _pts = {
					start: -rad,
					end: rad,
				};

				return {
					start: _pts.start,
					end: _pts.end,
					length: 2*rad,
					center: [0, 0],
					TL: [_pts.start, _pts.start],
					TR: [_pts.end, _pts.start],
					BL: [_pts.start, _pts.end],
					BR: [_pts.end, _pts.end],		
				};
			};


			// points/counts/lengths for initial-construction shapes:
			const _shp = (() =>
			{
				const s = _SquarePoints(64);

				s.gridSubdivs = 4;
				s.gridCell = s.length/s.gridSubdivs;
				s.btmBump = [0, s.end - s.gridCell]; // bottom bump-in
				s.leftBump = [s.start - s.gridCell, 0]; // left bumpout
	
				return s;

			})();


			// points/counts for pattern squares:
			const _sq = (() =>
			{
				const
					s = _SquarePoints(32),
					_bump = s.length/8;
	
				s.TLBump = [s.start + _bump, -_bump];
				s.TRBump = [_bump, s.start + _bump];
				s.BRBump = [s.end - _bump, _bump];
				s.scaleUp = _shp.length/s.length * Math.sqrt(2);
	
				return s;

			})();


			// other values for patterns:
			const _pat = (() =>
			{
				const p = {
					sqsPerSide: 3,
					gutter: 16, // px
				};
			
				p.shift = _sq.length * p.sqsPerSide + p.gutter;
	
				return p;
	
			})();


			// positions offset by 0.5px for lines:
			const _line = (() => {
	
				const
					_offset = 0.5,
					_gridStart = _shp.start + _offset,
					_gridEnd = _shp.end + _offset;
	
				return {
					cx: _offset,
					cy: _offset,
					gridTL: [_gridStart, _gridStart],
					gridTR: [_gridEnd, _gridStart],
					gridBL: [_gridStart, _gridEnd],
				};
	
			})();
	
	
	
			const points = {

				// for shapes/squares/patterns:

				center: () => _shp.center,

				shpTL: () => _shp.TL,
				shpBL: () => _shp.BL,
				shpBR: () => _shp.BR,
				shpBtmBump: () => _shp.btmBump,
				shpLeftBump: () => _shp.leftBump,
				gridSubdivs: () => _shp.gridSubdivs,
				gridCell: () => _shp.gridCell,

				sqTL: () => _sq.TL,
				sqTR: () => _sq.TR,
				sqBR: () => _sq.BR,
				sqTLBump: () => _sq.TLBump,
				sqTRBump: () => _sq.TRBump,
				sqBRBump: () => _sq.BRBump,
				sqLength: () => _sq.length,

				lineCx: () => _line.cx,
				lineCy: () => _line.cy,
				gridTL: () => _line.gridTL,
				gridTR: () => _line.gridTR,
				gridBL: () => _line.gridBL,

				sqsPerSide: () => _pat.sqsPerSide,
				patShift: () => _pat.shift,

				// accessors/functions for transforms:

				rotX: () => _shp.start,
				rotY: () => _shp.end,
				sqScaleUp: () => _sq.scaleUp,
				zoomSmall: () => 1/64,
				zoomLarge: () => 2,

				sq4: n =>
				{
					const
						zero_dist = -3 * _sq.length,
						unit_dist = 2 * _sq.length;
					
					return zero_dist + n * unit_dist;
				},

				sq3: n => {
					const zero_dist = -_pat.shift;
					return zero_dist + n * _pat.shift;
				},
			};
			
			
			return points;
	
		}, // end build
		
		
		loadOnce: () =>
		{
			if (! unit.isLoaded) {
				unit.contents = unit.build();
				unit.isLoaded = true;
			}
			
			return unit.contents;
		},
		
	}; // end unit
	
	
	return unit.loadOnce;
	
})(); // end t.demo(0).points
