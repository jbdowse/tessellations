'use strict';

// Namespace to encapsulate tessellation pattern definitions

var tessellations = function demo0patternsModule(t) {

	t.demo = t.demo || function () {
		var _demos = [];
		return function (index) {
			return _demos[index] = _demos[index] || {};
		};
	}();

	var _doBuildDemo0Patterns = function _doBuildDemo0Patterns() {
		var ds = t.ds(),
		    svg = t.idTypes().svg(),
		    pt = t.demo(0).points();

		t.demo(0).buildShapes();

		var _build = {

			generators: function () {

				var generatorList = [['loAc'], ['ssw'], ['nnw', 'ene', 'nnw', 'wsw', 'sse', 'wsw'], ['loAc', 'loGr', 'loAc'], ['ese', 'nne', 'ese', 'ssw', 'wnw', 'ssw'], ['wsw', 'ese', 'wsw', 'wnw', 'ene', 'wnw'], ['loAc', 'loGr'], ['ssw', 'sse'], ['sse', 'wnw'], ['loAc', 'hiGr'], ['ssw', 'nne', 'ssw'], ['sse', 'sse', 'sse', 'nne', 'nne', 'nne']];

				return function (index) {
					return generatorList[index];
				};
			}(),

			pattern: function pattern(patId, generatorsIndex) {
				var sqsPerSide = pt.sqsPerSide(),
				    generator = _build.generators(generatorsIndex),
				    generatorLength = generator.length,
				    shiftInterval = pt.sqLength(),
				    startShift = -shiftInterval;

				ds.forCount(sqsPerSide, function (row) {
					var shiftY = startShift + row * shiftInterval,
					    indexOffset = row * sqsPerSide;

					ds.forCount(sqsPerSide, function (column) {
						var squareIndex = indexOffset + column,
						    indexInGen = squareIndex % generatorLength,
						    squareDefId = generator[indexInGen],
						    shiftX = startShift + column * shiftInterval;

						svg(patId).defineAnon('use', ['href', '#' + squareDefId, 'x', shiftX, 'y', shiftY]);
					});
				});

				return _build;
			},

			patternSet: function patternSet(setIndex) {
				var patsPerSet = 3,
				    baseGeneratorIndex = setIndex * patsPerSet,
				    shiftInterval = pt.patShift(),
				    startShift = -shiftInterval;

				ds.forCount(patsPerSet, function (patIndex) {
					var patId = 'set' + setIndex + 'pat' + patIndex,
					    generatorIndex = baseGeneratorIndex + patIndex,
					    shift = startShift + patIndex * shiftInterval;

					svg('pats' + setIndex).add('g', patId);

					_build.pattern(patId, generatorIndex);

					svg(patId).attr(['transform', 'translate(' + shift + ', 0)']);
				});

				return _build;
			},

			initPat: function initPat() {
				var initPatGeneratorIndex = 9;
				_build.pattern('initPat', initPatGeneratorIndex);

				return _build;
			},

			patternSets: function patternSets() {
				var setCount = 4;

				ds.forCount(setCount, function (setIndex) {
					_build.patternSet(setIndex);
				});

				return _build;
			},

			allPatterns: function allPatterns() {
				_build.initPat().patternSets();

				return _build;
			}

		}; // end _build


		_build.allPatterns();

		return t.demo(0);
	}; // end _doBuildDemo0Patterns

	t.demo(0).buildPatterns = function () {
		return t.loadOnce(_doBuildDemo0Patterns);
	};

	return t;
}(tessellations || {});