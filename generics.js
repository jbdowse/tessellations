// Type builders + array functions

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};

tessellations.load.arrays = function() {

	const t = tessellations;

	t.arrays = {

		lift: function(x) {
			return Array.isArray(x)? x : [x];
		},

		arrayMax: function(arr) {
			return Array.isArray(arr) ?
				arr.reduce(function(a, b) {
					return Math.max(a, b);
				}) :
				arr;
		},

		csv: function(arr) {
			let str = '';
			let lastElement = arr[arr.length - 1];
			const allButLast = arr.slice(0,-1)
			for (const element of allButLast) {
				str += element + ', ';
			}
			str += lastElement;
			return str;
		},

		addIfNew: function(arr, element) {
			if (arr.indexOf(element) === -1) {
				arr.push(element);
			}
		},

		addIfPredicate: function(arr, element, predicate) {
			if (predicate) {
				arr.push(element);
			}
		},

		indexOfKey: function(arr, key, value) {
			for (let i = 0; i < arr.length; ++i) {
				if (arr[i][key] === value) {
					return i;
				}
			}
			return -1;
		},
	
		findByKey: function(arr, key, value) {
			for (let i = 0; i < arr.length; ++i) {
				if (arr[i][key] === value) {
					return arr[i];
				}
			}
			return null;
		}
	};
	
	return t.load;
};


tessellations.load.buildType = function() {

	const t = tessellations;
	

	const _copyPrototypeFields = function(proto) {
		const newObj = {};
		for (const key in proto) {
			newObj[key] = proto[key];
		}
		return newObj;		
	};


	t.buildType = {
	
		basic: function(type) {
			return function basicCreateObject() {
				let newObj = _copyPrototypeFields(type.proto);
				type.addInstanceVars(newObj);
				return newObj;
			}
		},

		cachingIdType: function(type) {

			return (function idTypeIIFE() {

				const cache = []; // private, shared by entire type ("static")

				function createObject(idStr) {
					let newObj = _copyPrototypeFields(type.proto);
					type.addInstanceVars(newObj, idStr);
					cache.push(newObj);
			    	return newObj;
				};

				return function getOrCreate(idStr) {
					const cachedObj = t.arrays.findByKey(cache, '_id', idStr);
					return cachedObj || createObject(idStr);
				};
				
			})();
		}
	};
	
	return t.load;

};
