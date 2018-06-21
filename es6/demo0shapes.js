// Defining the initial-construction shapes

var tessellations = tessellations || {};

tessellations.demo = tessellations.demo ||
	(index => tessellations.initDemos(index));


// *** note this and the other buildX's are command- rather than data-functions, because they're just modifying DOM elements
	
tessellations.demo(0).buildShapes = (function buildDemo0Shapes()
{

	const unit = {
	
		isLoaded: false,
	
	
		build: () =>
		{
			const
				t = tessellations,
				svg = t.idTypes().svg(),
				pt = t.demo(0).points(),
				g = t.geom();
	
			
			// using labeled code blocks instead of IIFEs for concision:
		
			buildGraphGrid: {

				g.line('gridlineHoriz', pt.gridTL(), pt.gridTR() );
				g.line('gridlineVert', pt.gridTL(), pt.gridBL() );

				const gridCell = pt.gridCell();

				for (let i = 0; i <= pt.gridSubdivs(); ++i) {

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
				}
			}


			buildMirrorLine: {

				const radius = 2 * pt.sqLength();
				const offsetX = pt.lineCx();
				const offsetY = pt.lineCy();
				const lineStartY = -radius + offsetY;
				const lineEndY = radius + offsetY;

				g.line('mirrorLine', [offsetX, lineStartY], [offsetX, lineEndY]);
		
			}


			definePolygonPoints: {

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
		
			}

		}, // end build
	
	
		loadOnce: () =>
		{
			if (! unit.isLoaded) {
				unit.build();
				unit.isLoaded = true;
			}
		
			return tessellations.demo(0);
		},
	
	}; // end unit
	

	return unit.loadOnce;

})(); // end t.demo(0).buildShapes
	



/* this doesn't really need the full loading infrastructure
but keeping it in case it gains the need for lazy loading: */

tessellations.demo(0).colors = (function getDemo0Colors()
{
	
	const unit = {
		
		isLoaded: false,
		
		contents: null,
		
		
		build: () => ({
			base: '#36c',
			rotator: '#c3c',
			TLTile: '#3c6',
			BLTile: '#fc0',
			BRTile: '#f36'
		}), // end build
		
		
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
	
})(); // end t.demo(0).colors




tessellations.demo(0).buildStyles = (function buildDemo0Styles()
{
	
	const unit = {
		
		isLoaded: false,
		
		
		build: () =>
		{
			const
				t = tessellations,
				ar = t.arrays(),
				getId = t.idTypes().id(), // distinguish from many id params below
				svg = t.idTypes().svg(),
				geom = t.geom(),
				pt = t.demo(0).points(),
				c = t.demo(0).colors();
		
			t.demo(0)
				.buildShapes()
				.buildPatterns();
	
	
			getId('caption').style('transitionTimingFunction', 'linear');
	
	
			hideAll: {
	
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
	
				ar.forEachOf(allAnimatedShapes, id =>
				{
					svg(id)
						.initStyle('display', 'none')
						.initStyle('opacity', 0);
				});
		
			}
	
	
			setBaseColor: {
		
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

				ar.forEachOf(baseColorShapes, id =>
				{
					svg(id).initStyle('fill', c.base);
				});
		
			}
	
	
			setRotationPoint: {
		
				const BLRotators = [
					'rotator',
					'diamond',
					'TLTile',
					'BLTile',
					'BRTile'
				];

				ar.forEachOf(BLRotators, id =>
				{
					const origin = geom.pxPt( pt.shpBL() );
					svg(id).initStyle('transformOrigin', origin);
				});
		
			}
	
	
			setSquarePositions: {
	
				const laterSquares = [
					'sq2init',
					'sq2flip',
					'sq4flip'
				];
	
				for (let i = 0; i < laterSquares.length; ++i)
				{
					const xpos = pt.sq4(i + 1);
					svg(laterSquares[i]).initStyle( 'transform', geom.shiftTo(xpos, 0) );
				}
		
			}
	
	
			setInitialScales: {
	
				svg('sq4init').initStyle(
					'transform',
					geom.scaleStr(pt.sqScaleUp(), pt.sqScaleUp())
				);
	
				svg('zoom').initStyle(
					'transform',
					geom.scaleStr(pt.zoomSmall(), pt.zoomSmall())
				);
		
			}
	
		}, // end build
		
		
		loadOnce: () =>
		{
			if (! unit.isLoaded) {
				unit.build();
				unit.isLoaded = true;
			}
			
			return tessellations.demo(0);
		},
		
	}; // end unit
	
	
	return unit.loadOnce;
	
})(); // end t.demo(0).buildStyles
