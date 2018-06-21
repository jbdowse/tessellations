// Type builders + array functions

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};

tessellations.load.allModules = () =>
{
	tessellations.load
	.arrays()
	.buildType()
	.idTypes()
	.geom()
	.animation()
	.player();
};


tessellations.load.arrays = (function loadArrays()
{
	const t = tessellations;
	
	let loaded = false;
	
	
	const loadModule = () =>
	{
		// using arrows here bc no use of (this)
		
		t.arrays = {


			lift: x => Array.isArray(x)? x : [x],


			arrayMax: arr => Array.isArray(arr) ?
				arr.reduce((a, b) => Math.max(a, b)) :
				arr,


			csv: arr => arr.join(', '),


			addIfNew: (arr, element) =>
			{
				if (arr.indexOf(element) === -1) {
					arr.push(element);
				}
			},


			addIfPredicate: (arr, element, predicate) =>
			{
				if (predicate) {
					arr.push(element);
				}
			},


			indexOfKey: (arr, key, value) =>
			{
				for (let i = 0; i < arr.length; ++i) {
					if (arr[i][key] === value) {
						return i;
					}
				}
				return -1;
			},
	
	
			findByKey: (arr, key, value) =>
			{
				for (let i = 0; i < arr.length; ++i) {
					if (arr[i][key] === value) {
						return arr[i];
					}
				}
				return null;
			},
			
		};
		
		
	};
	
	
	return function loadOnce()
	{
		if (! loaded) {
			loadModule();
			loaded = true;
		}
	
		return t.load;
	};
	
})();



tessellations.load.buildType = (function loadBuildType()
{
	const t = tessellations;
	
	let loaded = false;
	
	
	const loadModule = () =>
	{
		t.load.arrays();
		

		const _copyPrototypeFields = proto =>
		{
			const newObj = {};
			
			for (const key in proto) {
				newObj[key] = proto[key];
			}
			
			return newObj;		
		};


		t.buildType = {
	
			basic: type => (
				() => {
					const newObj = _copyPrototypeFields(type.proto);
					type.addInstanceVars(newObj);
					return newObj;
				}
			),


			cachingIdType: type => (
				(() =>
				{
					const cache = []; // private, shared by entire type ("static")

					const createObject = idStr =>
					{
						const newObj = _copyPrototypeFields(type.proto);
						type.addInstanceVars(newObj, idStr);
						cache.push(newObj);
				    	return newObj;
					};

					const getOrCreate = idStr =>
					{
						const cachedObj = t.arrays.findByKey(cache, '_id', idStr);
						return cachedObj || createObject(idStr);
					};
					
					return getOrCreate;
				
				})()
			),
		};
		
	}; // end loadModule
	
	
	return function loadOnce()
	{
		if (! loaded) {
			loadModule();
			loaded = true;
		}
	
		return t.load;
	};
	
})();
