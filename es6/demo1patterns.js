// Namespace to encapsulate tessellation pattern definitions

var tessellations = tessellations || {};
tessellations.build = tessellations.build || {};
tessellations.build.demo1 = tessellations.build.demo1 || {};


tessellations.build.demo1.patterns = (function buildDemo1Patterns()
{
	const t = tessellations;
	
	let built = false;
	
	
	const buildComponent = () =>
	{
		t.load.idTypes();
		
		t.initializeDemos();
		
		t.build.demo1
		.points()
		.shapes();
		

		const generators = (() => {

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

			return index => generatorList[index];

		})();


		const buildPattern = (patId, generatorsIndex) =>
		{
			const
				pt = t.demo(1).points,
				sqsPerSide = pt.sqsPerSide(),
				generator = generators(generatorsIndex),
				generatorLength = generator.length,
				shiftInterval = pt.sqLength(),
				startShift = -shiftInterval;

			for (let row = 0; row < sqsPerSide; ++row)
			{
				const
					shiftY = startShift + row * shiftInterval,
					indexOffset = row * sqsPerSide;
	
				for (let column = 0; column < sqsPerSide; ++column)
				{
					const
						squareIndex =  indexOffset + column,
						indexInGen = squareIndex % generatorLength,
						squareDefId = generator[indexInGen],
						shiftX = startShift + column * shiftInterval;
		
					t.svg(patId).defineAnon('use', [
						'href', '#' + squareDefId,
						'x', shiftX,
						'y', shiftY,
					]);
				}
			}
		};


		const buildPatternSet = setIndex =>
		{
			const
				patsPerSet = 3,
				baseGeneratorIndex = setIndex * patsPerSet,
				shiftInterval = t.demo(1).points.patShift(),
				startShift = -shiftInterval;

			for (let patIndex = 0; patIndex < patsPerSet; ++patIndex)
			{
				const
					patId = 'set' + setIndex + 'pat' + patIndex,
					generatorIndex = baseGeneratorIndex + patIndex,
					shift = startShift + patIndex * shiftInterval;
	
				t.svg('pats' + setIndex).add('g', patId);
	
				buildPattern(patId, generatorIndex);
	
				t.svg(patId).attr([
					'transform', 'translate(' + shift + ', 0)'
				]);
			}
		};
		
		
		// trying out labeled code blocks instead of IIFEs here:
		
		buildInitPat: {
			const initPatGeneratorIndex = 9;
			buildPattern('initPat', initPatGeneratorIndex);
		}


		buildPatternSets: {
			const setCount = 4;
			for (let setIndex = 0; setIndex < setCount; ++setIndex) {
				buildPatternSet(setIndex);
			}
		}
	
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
