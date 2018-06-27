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
	
			copyProps: (() => {
				
				const copy = {
					
					allProps: protoList =>
					{
						const newObj = {};
					
						ds.forEachOf(protoList, proto => {
							for (const propName in proto) {
								newObj[propName] = proto[propName];
							}
						});
						
						return newObj;
					},
					
					someProps: (protoList, propNames) =>
					{
						const newObj = {};
					
						ds.forEachOf(protoList, proto => {
							ds.forEachOf(propNames, propName => {
								if (proto[propName]) {
									newObj[propName] = proto[propName];
								}
							});
						});
						
						return newObj;
					},
				};
				
				return (protos, propNames) =>
				{
					const protoList = ds.lift(protos);
				
					return propNames?
						copy.someProps(protoList, propNames) :
						copy.allProps(protoList);
				};
				
			})(),
			
		}; // end ds
		
		
		return ds;
	
	}; // end _getDs
	
	t.ds = () => t.loadOnce(_getDs);
	

	
	
	const _getTypeBuilder = () => {
	
		const ds = t.ds();
	

		const typeBuilder = {

			basic: type =>
				() => ds.copyProps([
					type.methods,
					type.instance() // still need this to be a fn call rather than plain object in general so don't get e.g. [] shared by all instances
				]),


			cachingIdType: type =>
				(() => {
					
					const ct = {
						
						cache: {}, // private, shared by entire type ("static")

						createObject: idStr =>
						{
							const newObj = ds.copyProps([
								type.methods,
								type.instance(idStr)
							]);

							ct.cache[idStr] = newObj;
						
					    	return newObj;
						},

						getOrCreate: idStr => ct.cache[idStr] || ct.createObject(idStr),
					};
			
					return ct.getOrCreate;
		
				})(),
			
		}; // end typeBuilder
		
		
		return typeBuilder;
	
	}; // end _getTypeBuilder
	
	t.typeBuilder = () => t.loadOnce(_getTypeBuilder);
	
	
	return t;
	
})(tessellations || {});
