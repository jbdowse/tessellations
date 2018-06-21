'use strict';

// Type builders + array functions

var tessellations = tessellations || {};

tessellations.arrays = function getArrays() {

	var unit = {

		isLoaded: false,

		contents: null,

		build: function build() {
			return {

				lift: function lift(x) {
					return Array.isArray(x) ? x : [x];
				},

				forEachOf: function forEachOf(arr, func) {
					for (var i = 0; i < arr.length; ++i) {
						func(arr[i]);
					}
				},

				forCount: function forCount(count, func) {
					for (var i = 0; i < count; ++i) {
						func(i);
					}
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
		}, // end build


		loadOnce: function loadOnce() {
			if (!unit.isLoaded) {
				unit.contents = unit.build();
				unit.isLoaded = true;
			}

			return unit.contents;
		}

	}; // end unit


	return unit.loadOnce;
}();

tessellations.buildType = function getBuildType() {
	var unit = {

		isLoaded: false,

		contents: null,

		build: function build() {

			var ar = tessellations.arrays();

			var _copyPrototypeFields = function _copyPrototypeFields(proto) {
				var newObj = {};

				for (var key in proto) {
					newObj[key] = proto[key];
				}

				return newObj;
			};

			return {

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
							var cachedObj = ar.findByKey(cache, '_id', idStr);
							return cachedObj || createObject(idStr);
						};

						return getOrCreate;
					}();
				}

			}; // end build return obj
		}, // end build


		loadOnce: function loadOnce() {
			if (!unit.isLoaded) {
				unit.contents = unit.build();
				unit.isLoaded = true;
			}

			return unit.contents;
		}

	}; // end unit


	return unit.loadOnce;
}();