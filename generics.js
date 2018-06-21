'use strict';

// Type builders + array functions

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};

tessellations.load.allModules = function () {
	tessellations.load.arrays().buildType().idTypes().geom().animation().player();
};

tessellations.load.arrays = function loadArrays() {
	var t = tessellations;

	var loaded = false;

	var loadModule = function loadModule() {
		// using arrows here bc no use of (this)

		t.arrays = {

			lift: function lift(x) {
				return Array.isArray(x) ? x : [x];
			},

			arrayMax: function arrayMax(arr) {
				return Array.isArray(arr) ? arr.reduce(function (a, b) {
					return Math.max(a, b);
				}) : arr;
			},

			csv: function csv(arr) {
				return arr.join(', ');
			},

			addIfNew: function addIfNew(arr, element) {
				if (arr.indexOf(element) === -1) {
					arr.push(element);
				}
			},

			addIfPredicate: function addIfPredicate(arr, element, predicate) {
				if (predicate) {
					arr.push(element);
				}
			},

			indexOfKey: function indexOfKey(arr, key, value) {
				for (var i = 0; i < arr.length; ++i) {
					if (arr[i][key] === value) {
						return i;
					}
				}
				return -1;
			},

			findByKey: function findByKey(arr, key, value) {
				for (var i = 0; i < arr.length; ++i) {
					if (arr[i][key] === value) {
						return arr[i];
					}
				}
				return null;
			}

		};
	};

	return function loadOnce() {
		if (!loaded) {
			loadModule();
			loaded = true;
		}

		return t.load;
	};
}();

tessellations.load.buildType = function loadBuildType() {
	var t = tessellations;

	var loaded = false;

	var loadModule = function loadModule() {
		t.load.arrays();

		var _copyPrototypeFields = function _copyPrototypeFields(proto) {
			var newObj = {};

			for (var key in proto) {
				newObj[key] = proto[key];
			}

			return newObj;
		};

		t.buildType = {

			basic: function basic(type) {
				return function () {
					var newObj = _copyPrototypeFields(type.proto);
					type.addInstanceVars(newObj);
					return newObj;
				};
			},

			cachingIdType: function cachingIdType(type) {
				return function () {
					var cache = []; // private, shared by entire type ("static")

					var createObject = function createObject(idStr) {
						var newObj = _copyPrototypeFields(type.proto);
						type.addInstanceVars(newObj, idStr);
						cache.push(newObj);
						return newObj;
					};

					var getOrCreate = function getOrCreate(idStr) {
						var cachedObj = t.arrays.findByKey(cache, '_id', idStr);
						return cachedObj || createObject(idStr);
					};

					return getOrCreate;
				}();
			}
		};
	}; // end loadModule


	return function loadOnce() {
		if (!loaded) {
			loadModule();
			loaded = true;
		}

		return t.load;
	};
}();