'use strict';

// Namespace to encapsulate tessellation pattern definitions

var tessellations = tessellations || {};

tessellations.demo = tessellations.demo || function (index) {
	return tessellations.initDemos(index);
};

tessellations.demo(0).buildPatterns = function buildDemo0Patterns() {

	var unit = {

		isLoaded: false,

		build: function build() {
			var t = tessellations,
			    ar = t.arrays(),
			    svg = t.idTypes().svg(),
			    pt = t.demo(0).points();

			// t.demo(0).buildShapes();


			var generators = function () {

				var generatorList = [['loAc'], ['ssw'], ['nnw', 'ene', 'nnw', 'wsw', 'sse', 'wsw'], ['loAc', 'loGr', 'loAc'], ['ese', 'nne', 'ese', 'ssw', 'wnw', 'ssw'], ['wsw', 'ese', 'wsw', 'wnw', 'ene', 'wnw'], ['loAc', 'loGr'], ['ssw', 'sse'], ['sse', 'wnw'], ['loAc', 'hiGr'], ['ssw', 'nne', 'ssw'], ['sse', 'sse', 'sse', 'nne', 'nne', 'nne']];

				return function (index) {
					return generatorList[index];
				};
			}();

			var buildPattern = function buildPattern(patId, generatorsIndex) {
				var sqsPerSide = pt.sqsPerSide(),
				    generator = generators(generatorsIndex),
				    generatorLength = generator.length,
				    shiftInterval = pt.sqLength(),
				    startShift = -shiftInterval;

				ar.forCount(sqsPerSide, function (row) {
					var shiftY = startShift + row * shiftInterval,
					    indexOffset = row * sqsPerSide;

					ar.forCount(sqsPerSide, function (column) {
						var squareIndex = indexOffset + column,
						    indexInGen = squareIndex % generatorLength,
						    squareDefId = generator[indexInGen],
						    shiftX = startShift + column * shiftInterval;

						svg(patId).defineAnon('use', ['href', '#' + squareDefId, 'x', shiftX, 'y', shiftY]);
					});
				});
			};

			var buildPatternSet = function buildPatternSet(setIndex) {
				var patsPerSet = 3,
				    baseGeneratorIndex = setIndex * patsPerSet,
				    shiftInterval = pt.patShift(),
				    startShift = -shiftInterval;

				ar.forCount(patsPerSet, function (patIndex) {
					var patId = 'set' + setIndex + 'pat' + patIndex,
					    generatorIndex = baseGeneratorIndex + patIndex,
					    shift = startShift + patIndex * shiftInterval;

					svg('pats' + setIndex).add('g', patId);

					buildPattern(patId, generatorIndex);

					svg(patId).attr(['transform', 'translate(' + shift + ', 0)']);
				});
			};

			buildInitPat: {
				var initPatGeneratorIndex = 9;
				buildPattern('initPat', initPatGeneratorIndex);
			}

			buildPatternSets: {
				var setCount = 4;
				for (var setIndex = 0; setIndex < setCount; ++setIndex) {
					buildPatternSet(setIndex);
				}
			}
		}, // end build


		loadOnce: function loadOnce() {
			if (!unit.isLoaded) {
				unit.build();
				unit.isLoaded = true;
			}

			return tessellations.demo(0);
		}

	}; // end unit


	return unit.loadOnce;
}(); // end t.demo(0).buildPatterns