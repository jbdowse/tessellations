// Namespace to encapsulate tessellation pattern definitions

var tessellations = (function demo0patternsModule(t)
{

	t.demo = t.demo || (() => {
		const _demos = [];
		return index => (_demos[index] = _demos[index] || {});
	})();
	


	const _buildDemo0Patterns = () => 
	{
		const
			ar = t.arrays(),
			svg = t.idTypes().svg(),
			pt = t.demo(0).points();
		
		t.demo(0).buildShapes();
		
	
		const _build = {
			
			
			generators: (() => {

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

			})(),
			
			
			pattern: (patId, generatorsIndex) =>
			{
				const
					sqsPerSide = pt.sqsPerSide(),
					generator = _build.generators(generatorsIndex),
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
				
				return _build;
			},
			
			
			patternSet: setIndex =>
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

					_build.pattern(patId, generatorIndex);

					svg(patId).attr([
						'transform', 'translate(' + shift + ', 0)'
					]);
				});
				
				return _build;
			},
			
			
			initPat: () =>
			{
				const initPatGeneratorIndex = 9;
				_build.pattern('initPat', initPatGeneratorIndex);
				
				return _build;
			},
			
			
			patternSets: () =>
			{
				const setCount = 4;
			
				ar.forCount(setCount, setIndex => {
					_build.patternSet(setIndex);
				});
				
				return _build;
			},
			
			
			allPatterns: () =>
			{
				_build
					.initPat()
					.patternSets();
				
				return _build;
			},
			
		}; // end _build

		
		_build.allPatterns();
		
		
		return t.demo(0);
		

	}; // end _buildDemo0Patterns
	
	t.demo(0).buildPatterns = () => t.loadOnce(_buildDemo0Patterns);

	
	return t;
	
})(tessellations || {});
