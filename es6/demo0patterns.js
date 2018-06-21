// Namespace to encapsulate tessellation pattern definitions

var tessellations = tessellations || {};

tessellations.demo = tessellations.demo ||
	(index => tessellations.initDemos(index));


tessellations.demo(0).buildPatterns = (function buildDemo0Patterns()
{
	
	const unit = {
		
		isLoaded: false,
		
		
		build: () => 
		{
			const
				t = tessellations,
				ar = t.arrays(),
				svg = t.idTypes().svg(),
				pt = t.demo(0).points();
			
			// t.demo(0).buildShapes();
		

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
					sqsPerSide = pt.sqsPerSide(),
					generator = generators(generatorsIndex),
					generatorLength = generator.length,
					shiftInterval = pt.sqLength(),
					startShift = -shiftInterval;


				ar.forCount(sqsPerSide, row =>
				{
					const
						shiftY = startShift + row * shiftInterval,
						indexOffset = row * sqsPerSide;


					ar.forCount(sqsPerSide, column =>
					{
						const
							squareIndex =  indexOffset + column,
							indexInGen = squareIndex % generatorLength,
							squareDefId = generator[indexInGen],
							shiftX = startShift + column * shiftInterval;
	
	
						svg(patId).defineAnon('use', [
							'href', '#' + squareDefId,
							'x', shiftX,
							'y', shiftY,
						]);
					});
				});
			};


			const buildPatternSet = setIndex =>
			{
				const
					patsPerSet = 3,
					baseGeneratorIndex = setIndex * patsPerSet,
					shiftInterval = pt.patShift(),
					startShift = -shiftInterval;


				ar.forCount(patsPerSet, patIndex =>
				{
					const
						patId = 'set' + setIndex + 'pat' + patIndex,
						generatorIndex = baseGeneratorIndex + patIndex,
						shift = startShift + patIndex * shiftInterval;


					svg('pats' + setIndex).add('g', patId);

					buildPattern(patId, generatorIndex);

					svg(patId).attr([
						'transform', 'translate(' + shift + ', 0)'
					]);
				});
			};
		
		
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
	
})(); // end t.demo(0).buildPatterns
