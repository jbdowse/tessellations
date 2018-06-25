// Type builders + array functions

var tessellations = (function genericsModule(t)
{
	/* build is now a function, and gets .hasRun & .value properties added to it;
	this requires storing each build function in a variable first and then
	feeding that to t.loadOnce, rather than using the function literal as
	argument to t.loadOnce */

	t.loadOnce = build =>
	{
		if (! build.hasRun) {
			build.value = build();
			build.hasRun = true;
		}

		return build.value;
	};
	
	

	const _getDs = () =>
	{
		// ds = 'data structures'
		
		const ds = {
		
	
			lift: x => Array.isArray(x)? x : [x],


			forEachOf: (arr, func) =>
			{
				for (let i = 0; i < arr.length; ++i)
				{
					func(arr[i]);
				}
				return ds;
			},
	
	
			forCount: (count, func) =>
			{
				for (let i = 0; i < count; ++i)
				{
					func(i);
				}
				return ds;
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
				return ds;
			},


			addIfPredicate: (arr, element, predicate) =>
			{
				if (predicate) {
					arr.push(element);
				}
				return ds;
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
		
	
			accessors: valueObject =>
			{
				const accessors = {};
	
				for (const propName in valueObject)
				{
					accessors[propName] = (typeof valueObject[propName] === 'function'?
						valueObject[propName] :
						() => valueObject[propName]
					);
				}
	
				return accessors;
			},
		
	
			accessorsEvenForFns: valueObject =>
			{
				const accessors = {};
	
				for (const propName in valueObject) {
					accessors[propName] = () => valueObject[propName];
				}
	
				return accessors;
			},
			
			
			// copyProps works for single source object or arrays of them;
			// later source properties override earlier ones of same name:
	
			copyProps: (protos, propNameListToCopy) =>
			{
				const protoList = ds.lift(protos);
				
				const newObj = {};
				
				if (propNameListToCopy) {
					// copy just the listed properties
					
					ds.forEachOf(protoList, proto => {
						ds.forEachOf(propNameListToCopy, propName => {
							if (proto[propName]) {
								newObj[propName] = proto[propName];
							}
						});
					})
				}
				else {
					// copy all properties
					
					ds.forEachOf(protoList, proto => {
						for (const propName in proto) {
							newObj[propName] = proto[propName];
						}
					});
				}
			
				return newObj;
			},
			
		}; // end ds
		
		
		return ds;
	
	}; // end _getDs
	
	t.ds = () => t.loadOnce(_getDs);
	

	
	
	const _getBuildType = () => {
	
		const ds = t.ds();
	

		const _typeBuilders = {

			basic: type =>
				() => {
					const newObj = ds.copyProps(type.proto);
					type.addInstanceVars(newObj);
					return newObj;
				},


			cachingIdType: type =>
				(() => {
				
					const cache = []; // private, shared by entire type ("static")

					const createObject = idStr =>
					{
						const newObj = ds.copyProps(type.proto);
						type.addInstanceVars(newObj, idStr);
						cache.push(newObj);
				    	return newObj;
					};

					const getOrCreate = idStr =>
					{
						const cachedObj = ds.findByKey(cache, '_id', idStr);
						return cachedObj || createObject(idStr);
					};
			
					return getOrCreate;
		
				})(),
			
		}; // end _typeBuilders
		
		
		return _typeBuilders;
	
	}; // end _getBuildType
	
	t.buildType = () => t.loadOnce(_getBuildType);
	
	
	return t;
	
})(tessellations || {});
