// Namespace to encapsulate tessellation pattern definitions

var tessellations = tessellations || {};
tessellations.build = tessellations.build || {};
tessellations.build.demo1 = tessellations.build.demo1 || {};


tessellations.build.demo1.patterns = (function buildDemo1Patterns()
{
	const t = tessellations;
	
	let built = false;
	
	
	const buildComponent = function()
	{
	
		// t.demo(1) & t.demo(1).points assumed to be already initialized
		
		t.build.demo1
		.points()
		.shapes();
		

		const generators = (function generatorsDefn() {

			const generatorList = [
				['loAc'],
				['ssw'],
				['nnw', 'ene', 'nnw', 'wsw', 'sse', 'wsw'],

				['loAc', 'loGr', 'loAc'],
				['ese', 'nne', 'ese', 'ssw', 'wnw', 'ssw'],
				['wsw', 'ese', 'wsw', 'wnw', 'ene', 'wnw'],

				['loAc', 'loGr'],
				['ssw', 'sse'],
				['sse', 'wnw'],

				['loAc', 'hiGr'],
				['ssw', 'nne', 'ssw'],
				['sse', 'sse', 'sse', 'nne', 'nne', 'nne'],
			];

			return function(index) {
				return generatorList[index];
			};

		})();


		const buildPattern = function(patId, generatorsIndex)
		{
			const pt = t.demo(1).points;

			const sqsPerSide = pt.sqsPerSide();

			const generator = generators(generatorsIndex);
			const generatorLength = generator.length;

			const shiftInterval = pt.sqLength();
			const startShift = -shiftInterval;

			for (let row = 0; row < sqsPerSide; ++row)
			{
				const shiftY = startShift + row * shiftInterval;
	
				const indexOffset = row * sqsPerSide;
	
				for (let column = 0; column < sqsPerSide; ++column)
				{
					const squareIndex =  indexOffset + column;
					const indexInGen = squareIndex % generatorLength;
					const squareDefId = generator[indexInGen];
		
					const shiftX = startShift + column * shiftInterval;
		
					t.svg(patId).defineAnon('use', [
						'href', '#' + squareDefId,
						'x', shiftX,
						'y', shiftY,
					]);
				}
			}
		};


		const buildPatternSet = function(setIndex)
		{
			const patsPerSet = 3;
			const baseGeneratorIndex = setIndex * patsPerSet;

			const shiftInterval = t.demo(1).points.patShift();
			const startShift = -shiftInterval;

			for (let patIndex = 0; patIndex < patsPerSet; ++patIndex) {
	
				const patId = 'set' + setIndex + 'pat' + patIndex;
				const generatorIndex = baseGeneratorIndex + patIndex;
				const shift = startShift + patIndex * shiftInterval;
	
				t.svg('pats' + setIndex).add('g', patId);
	
				buildPattern(patId, generatorIndex);
	
				t.svg(patId).attr([
					'transform', 'translate(' + shift + ', 0)'
				]);
			}
		};

	
		(function buildInitPat()
		{
			const initPatGeneratorIndex = 9;
			buildPattern('initPat', initPatGeneratorIndex);
		})();


		(function buildPatternSets()
		{
			const setCount = 4;
			for (let setIndex = 0; setIndex < setCount; ++setIndex) {
				buildPatternSet(setIndex);
			}
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
	
})(); // end t.build.demo1.patterns
