// Defining the initial-construction shapes

var tessellations = (function demo0shapesModule(t)
{
	
	t.demo = t.demo || (() => {
		const _demos = [];
		return index => (_demos[index] = _demos[index] || {});
	})();
	
	
	
	// note this and the other _do...'s are command- rather than data-functions, because they're just modifying DOM elements
	
	const _doBuildDemo0Shapes = () => {
		
		const
			ds = t.ds(),
			svg = t.idTypes().svg(),
			pt = t.demo(0).points(),
			g = t.geom();


		const _build = {
			
		
			graphGrid: () =>
			{
				g.line('gridlineHoriz', pt.gridTL(), pt.gridTR() );
				g.line('gridlineVert', pt.gridTL(), pt.gridBL() );

				const
					gridCell = pt.gridCell(),
					lineCount = pt.gridSubdivs() + 1;

				ds.forCount(lineCount, i => {

					svg('graphGrid')
						.defineAnon('use', [
							'href', '#gridlineHoriz',
							'x', 0,
							'y', i * gridCell
						])
						.defineAnon('use', [
							'href', '#gridlineVert',
							'x', i * gridCell,
							'y', 0
						]);
				});
				
				return _build;
			},


			mirrorLine: () =>
			{
				const
					radius = 2 * pt.sqLength(),
					offsetX = pt.lineCx(),
					offsetY = pt.lineCy(),
					lineStartY = -radius + offsetY,
					lineEndY = radius + offsetY;

				g.line('mirrorLine', [offsetX, lineStartY], [offsetX, lineEndY]);
				
				return _build;
			},


			polygonPoints: () =>
			{
				g.points('base', [
					pt.shpTL(),
					pt.shpBL(),
					pt.shpBR()
				]);

				g.points('carved', [
					pt.shpTL(),
					pt.shpBL(),
					pt.shpBtmBump(),
					pt.shpBR()
				]);

				g.points('rotator', [
					pt.shpBL(),
					pt.shpBtmBump(),
					pt.shpBR()
				]);

				g.points('tile', [
					pt.shpTL(),
					pt.shpLeftBump(),
					pt.shpBL(),
					pt.shpBtmBump(),
					pt.shpBR()
				]);

				g.points('singleTile', [
					pt.sqTL(),
					pt.sqTLBump(),
					pt.center(),
					pt.sqTRBump(),
					pt.sqTR()
				]);

				g.points('doubleTile', [
					pt.sqTL(),
					pt.sqTLBump(),
					pt.sqBRBump(),
					pt.sqBR(),
					pt.sqTR()
				]);
				
				return _build;
			},
			
			
			allShapes: () =>
			{
				_build
					.graphGrid()
					.mirrorLine()
					.polygonPoints();
				
				return _build;
			},
		
		}; // end _build
		
		
		_build.allShapes();
		
		
		return t.demo(0);

	}; // end _doBuildDemo0Shapes

	t.demo(0).buildShapes = () => t.loadOnce(_doBuildDemo0Shapes);




	/* this doesn't really need the full loading infrastructure
	but keeping it in case it gains the need for lazy loading: */
	
	const _getDemo0Colors = () =>
	{
		const colors = {
			base: '#36c',
			rotator: '#c3c',
			TLTile: '#3c6',
			BLTile: '#fc0',
			BRTile: '#f36',
		};
		
		const accessors = t.ds().accessors(colors);
		
		return accessors;
	};
	
	t.demo(0).colors = () => t.loadOnce(_getDemo0Colors);



	const _doBuildDemo0Styles = () => {
		
		const
			ds = t.ds(),
			getId = t.idTypes().id(), // distinguish from many id params below
			svg = t.idTypes().svg(),
			geom = t.geom(),
			pt = t.demo(0).points(),
			c = t.demo(0).colors();

		t.demo(0)
			.buildShapes()
			.buildPatterns();

		
		const _init = {
			
			
			setCaptionTiming: () =>
			{
				getId('caption').style('transitionTimingFunction', 'linear');
				return _init;
			},


			hideAll: () =>
			{
				const allAnimatedShapes = [
					'graphGrid',
					'base',
					'carved',
					'rotator',
					'diamond',
					'TLTile',
					'BLTile',
					'BRTile',
					'initPat',
					'sq4init',
					'sq4flip',
					'sq2init',
					'sq2flip',
					'mirrorLine',
					'pats0',
					'pats1',
					'pats2',
					'pats3',
					'zoom'
				];

				ds.forEachOf(allAnimatedShapes, id =>
				{
					svg(id)
						.initStyle('display', 'none')
						.initStyle('opacity', 0);
				});

				return _init;
			},


			setBaseColor: () =>
			{
				const baseColorShapes = [
					'base',
					'carved',
					'rotator',
					'initTile',
					'TLTile',
					'BLTile',
					'BRTile',
					'zoom'
				];

				ds.forEachOf(baseColorShapes, id =>
				{
					svg(id).initStyle('fill', c.base());
				});

				return _init;
			},


			setRotationPoint: () =>
			{
				const BLRotators = [
					'rotator',
					'diamond',
					'TLTile',
					'BLTile',
					'BRTile'
				];

				ds.forEachOf(BLRotators, id =>
				{
					const origin = geom.pxPt( pt.shpBL() );
					svg(id).initStyle('transformOrigin', origin);
				});

				return _init;
			},


			setSquarePositions: () =>
			{
				const laterSquares = [
					'sq2init',
					'sq2flip',
					'sq4flip'
				];

				ds.forCount(laterSquares.length, i =>
				{
					const xpos = pt.sq4(i + 1);
					svg(laterSquares[i]).initStyle( 'transform', geom.shiftTo(xpos, 0) );
				});

				return _init;
			},


			setInitialScales: () =>
			{
				svg('sq4init').initStyle(
					'transform',
					geom.scaleStr(pt.sqScaleUp(), pt.sqScaleUp())
				);

				svg('zoom').initStyle(
					'transform',
					geom.scaleStr(pt.zoomSmall(), pt.zoomSmall())
				);

				return _init;
			},
			
			
			allStyles: () =>
			{
				_init
					.hideAll()
					.setCaptionTiming()
					.setBaseColor()
					.setRotationPoint()
					.setSquarePositions()
					.setInitialScales();
					
				return _init;
			},
			
		}; // end _init
		
		
		_init.allStyles();
		
		
		return t.demo(0);

	}; // end _doBuildDemo0Styles
	
	t.demo(0).buildStyles = () => t.loadOnce(_doBuildDemo0Styles);
	
	
	return t;
	
})(tessellations || {});
