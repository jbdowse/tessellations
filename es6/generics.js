// Type builders + array functions

var tessellations = tessellations || {};


tessellations.arrays = (function getArrays()
{
	
	const unit = {
		
		isLoaded: false,
		
		contents: null,
		
		
		build: () => ({
			
			lift: x => Array.isArray(x)? x : [x],
	
	
			forEachOf: (arr, func) =>
			{
				for (let i = 0; i < arr.length; ++i)
				{
					func(arr[i]);
				}
			},
			
			
			forCount: (count, func) =>
			{
				for (let i = 0; i < count; ++i)
				{
					func(i);
				}
			},
	

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
			
		}), // end build
		
		
		loadOnce: () =>
		{
			if (! unit.isLoaded) {
				unit.contents = unit.build();
				unit.isLoaded = true;
			}
			
			return unit.contents;
		},
		
	}; // end unit
	
	
	return unit.loadOnce;
	
})();



tessellations.buildType = (function getBuildType()
{
	const unit = {
		
		isLoaded: false,
		
		contents: null,
		
		build: () => {
			
			const ar = tessellations.arrays();
			
			const _copyPrototypeFields = proto =>
			{
				const newObj = {};
			
				for (const key in proto) {
					newObj[key] = proto[key];
				}
			
				return newObj;		
			};


			return {
	
				basic: type =>
					() => {
						const newObj = _copyPrototypeFields(type.proto);
						type.addInstanceVars(newObj);
						return newObj;
					},


				cachingIdType: type =>
					(() => {
						
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
							const cachedObj = ar.findByKey(cache, '_id', idStr);
							return cachedObj || createObject(idStr);
						};
					
						return getOrCreate;
				
					})(),
					
			}; // end build return obj
			
		}, // end build
		
		
		loadOnce: () =>
		{
			if (! unit.isLoaded) {
				unit.contents = unit.build();
				unit.isLoaded = true;
			}
			
			return unit.contents;
		},
		
	}; // end unit
	
	
	return unit.loadOnce;
	
})();
