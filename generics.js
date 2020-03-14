// Type builders + array functions

var tessellations = function genericsModule(t) {
	/* build is now a function, and gets .hasRun & .value properties added to it;
 this requires storing each build function in a variable first and then
 feeding that to t.loadOnce, rather than using the function literal as
 argument to t.loadOnce */

	t.loadOnce = function (build) {
		if (!build.hasRun) {
			build.value = build();
			build.hasRun = true;
		}

		return build.value;
	};

	var _getDs = function _getDs() {
		// ds = 'data structures'

		var ds = {

			lift: function lift(x) {
				return Array.isArray(x) ? x : [x];
			},

			forEachOf: function forEachOf(arr, func) {
				for (var i = 0; i < arr.length; ++i) {
					func(arr[i]);
				}
				return ds;
			},

			forCount: function forCount(count, func) {
				for (var i = 0; i < count; ++i) {
					func(i);
				}
				return ds;
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
				return ds;
			},

			addIfPredicate: function addIfPredicate(arr, element, predicate) {
				if (predicate) {
					arr.push(element);
				}
				return ds;
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
			},

			accessors: function accessors(valueObject) {
				var accessors = {};

				var _loop = function _loop(propName) {
					accessors[propName] = typeof valueObject[propName] === 'function' ? valueObject[propName] : function () {
						return valueObject[propName];
					};
				};

				for (var propName in valueObject) {
					_loop(propName);
				}

				return accessors;
			},

			accessorsEvenForFns: function accessorsEvenForFns(valueObject) {
				var accessors = {};

				var _loop2 = function _loop2(propName) {
					accessors[propName] = function () {
						return valueObject[propName];
					};
				};

				for (var propName in valueObject) {
					_loop2(propName);
				}

				return accessors;
			},

			// copyProps works for single source object or arrays of them;
			// later source properties override earlier ones of same name:

			copyProps: function () {

				var copy = {

					allProps: function allProps(protoList) {
						var newObj = {};

						ds.forEachOf(protoList, function (proto) {
							for (var propName in proto) {
								newObj[propName] = proto[propName];
							}
						});

						return newObj;
					},

					someProps: function someProps(protoList, propNames) {
						var newObj = {};

						ds.forEachOf(protoList, function (proto) {
							ds.forEachOf(propNames, function (propName) {
								if (proto[propName]) {
									newObj[propName] = proto[propName];
								}
							});
						});

						return newObj;
					}
				};

				return function (protos, propNames) {
					var protoList = ds.lift(protos);

					return propNames ? copy.someProps(protoList, propNames) : copy.allProps(protoList);
				};
			}()

		}; // end ds


		return ds;
	}; // end _getDs

	t.ds = function () {
		return t.loadOnce(_getDs);
	};

	var _getTypeBuilder = function _getTypeBuilder() {

		var ds = t.ds();

		var typeBuilder = {

			basic: function basic(type) {
				return function () {
					return ds.copyProps([type.methods, type.instance() // still need this to be a fn call rather than plain object in general so don't get e.g. [] shared by all instances
					]);
				};
			},

			cachingIdType: function cachingIdType(type) {
				return function () {

					var ct = {

						cache: {}, // private, shared by entire type ("static")

						createObject: function createObject(idStr) {
							var newObj = ds.copyProps([type.methods, type.instance(idStr)]);

							ct.cache[idStr] = newObj;

							return newObj;
						},

						getOrCreate: function getOrCreate(idStr) {
							return ct.cache[idStr] || ct.createObject(idStr);
						}
					};

					return ct.getOrCreate;
				}();
			}

		}; // end typeBuilder


		return typeBuilder;
	}; // end _getTypeBuilder

	t.typeBuilder = function () {
		return t.loadOnce(_getTypeBuilder);
	};

	return t;
}(tessellations || {});