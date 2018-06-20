// Defining the initial-construction shapes

var tessellations = tessellations || {};
tessellations.build = tessellations.build || {};
tessellations.build.demo1 = tessellations.build.demo1 || {};


tessellations.build.demo1.shapes = (function buildDemo1Shapes()
{
	const t = tessellations;
	
	let built = false;
	
	
	const buildComponent = function()
	{
	
		t.load
		.idTypes()
		.geom();
		
		t.build.demo1.points();
		
	
		const svg = t.svg;
		const pt = t.demo(1).points;
		const g = t.geom;
	
	
		(function buildGraphGrid() {

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
		})();


		(function buildMirrorLine() {

			const radius = 2 * pt.sqLength();
			const offsetX = pt.lineCx();
			const offsetY = pt.lineCy();
			const lineStartY = -radius + offsetY;
			const lineEndY = radius + offsetY;

			g.line('mirrorLine', [offsetX, lineStartY], [offsetX, lineEndY]);
		
		})();


		(function definePolygonPoints() {

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
		
		})();

	}; // end buildComponent
	
	
	return function buildOnce()
	{
		if (! built) {
			buildComponent();
			built = true;
		}
	
		return t.build.demo1;
	};
	
})(); // end t.build.demo1.shapes
	


tessellations.build.demo1.styles = (function buildDemo1Styles()
{
	const t = tessellations;
	
	let built = false;
	
	
	const buildComponent = function()
	{
		
		t.load
		.idTypes()
		.geom();
		
		t.build.demo1
		.points()
		.shapes()
		.patterns();
		
		
	
		// t.demo(1) & t.demo(1).points assumed to be already initialized
	
		t.demo(1).colors = {
			base: '#36c',
			rotator: '#c3c',
			TLTile: '#3c6',
			BLTile: '#fc0',
			BRTile: '#f36'
		};

		
		const svg = t.svg;
		const pt = t.demo(1).points;
		const c = t.demo(1).colors;
		const scaleStr = t.geom.scaleStr;
	
	
		t.id('caption').style('transitionTimingFunction', 'linear');
	
	
		(function hideAll() {
	
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
	
			for (const id of allAnimatedShapes) {
				svg(id)
					.initStyle('display', 'none')
					.initStyle('opacity', 0);
			}
		
		})();
	
	
		(function setBaseColor() {
		
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

			for (const id of baseColorShapes) {
				svg(id).initStyle('fill', c.base);
			}
		
		})();
	
	
		(function setRotationPoint() {
		
			const BLRotators = [
				'rotator',
				'diamond',
				'TLTile',
				'BLTile',
				'BRTile'
			];

			for (const id of BLRotators) {
				const origin = t.geom.pxPt( pt.shpBL() );
				svg(id).initStyle('transformOrigin', origin);
			}
		
		})();
	
	
		(function setSquarePositions() {
	
			const laterSquares = [
				'sq2init',
				'sq2flip',
				'sq4flip'
			];
	
			for (let i = 0; i < laterSquares.length; ++i) {
				const xpos = pt.sq4(i + 1);
				svg(laterSquares[i]).initStyle( 'transform', t.geom.shiftTo(xpos, 0) );
			}
		
		})();
	
	
		(function setInitialScales() {
	
			svg('sq4init').initStyle('transform', scaleStr(pt.sqScaleUp(), pt.sqScaleUp()) );
	
			svg('zoom').initStyle('transform', scaleStr(pt.zoomSmall(), pt.zoomSmall()) );
		
		})();
	
	}; // end buildComponent
	
	
	return function buildOnce()
	{
		if (! built) {
			buildComponent();
			built = true;
		}
	
		return t.build.demo1;
	};

})(); // end t.build.demo1.styles
