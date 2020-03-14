// Wrappers for DOM elements + utility functions for SVG element definition

var tessellations = (function idTypesModule(t)
{

	const _getIdTypes = () => {	

		/* tess.svg(idStr) & tess.id(idStr) both return
		wrapped document element with ID idStr, with chainable
		methods as per the prototypes below
		*/
	
		const ds = t.ds();


		const _setAttrs = (element, attrList, ns) =>
		{
			for (let i = 0; i < attrList.length; i += 2)
			{
				let attrName = attrList[i];
				let attrValue = attrList[i + 1];
		
				if (ns.nsIsNeeded && attrName === 'href') {
					// only needed for SVG elements;
					// this is to fix the bug of dynamically-changed-(xlink:)href <use>s not appearing in Safari
					// see https://github.com/patrick-steele-idem/morphdom/issues/34
			
					element.setAttributeNS('http://www.w3.org/1999/xlink', attrName, attrValue);
				}
				else {
					element.setAttribute(attrName, attrValue);
				}
			}
		};

	
		const idType = {

			methods: {

				id: function() {
					return this._id;
				},

				// access to the unwrapped DOM element -
				// need to make _element an instance var:
				element: function() {
					return this._element;
				},

				tag: function(className) {
					this.element().classList.add(className);
					return this;
				},

				untag: function(className) {
					this.element().classList.remove(className);
					return this;
				},

				listen: function(event_type, func) {
					this.element().addEventListener(event_type, func, false);
					return this;
				},

				attr: function(attr_list) {
					_setAttrs(this.element(), attr_list, {});
					return this;
				},

				html: function(contents) {
					this.element().innerHTML = contents;
					return this;	
				},

				style: function(property, value) {
					this.element().style[property] = value;
					// console.log('style(): ' + this.id() + ' ' + property + ' changed to ' + value);
					return this;
				},
			
			}, // end idType.methods
	
	
			instance: idStr => ({
				
				_id: idStr,
				
				_element: document.getElementById(idStr),
				
			}),
	
		}; // end idType


		const svgType = {

			methods: (function()
			{

				const svgNS = 'http://www.w3.org/2000/svg';
				
				
				const svgBase = ds.copyProps(idType.methods, [
					'id',
					'element',
					'style',
					'tag',
					'untag',
					'listen',
				]);


				const svgExtensions = {

					attr: function(attr_list) {
						_setAttrs(this.element(), attr_list, {nsIsNeeded: true});
						return this;
					},
	
					on: function() {
						this.style('display', 'block');
						return this;
					},
	
					off: function() {
						this.style('display', 'none');
						return this;
					},
	
					initialStyles: function(){
						return this._initialStyles;
					},
	
	
					// need to make _initialStyles = [] an instance var:
					addInitialStyleIfNew: function(prop, val)
					{
						const propIndex = ds.indexOfKey(
							this.initialStyles(), 'property', prop);
					
						const propIsNew = (-1 === propIndex);
		
						ds.addIfPredicate(
							this._initialStyles,
							{property: prop, value: val},
							propIsNew
						);
			
						return this;
					},
	
	
					initStyle: function(prop, val)
					{
						this.addInitialStyleIfNew(prop, val)
							.style(prop, val);
						
						return this;
					},
	
	
					reset: function()
					{
						ds.forEachOf(this.initialStyles(), initialStyle =>
						{
							this.style(initialStyle.property, initialStyle.value);
						});
		
						this
						.style('display', 'none')
						.style('transitionProperty', '')
						.style('transitionDuration', '');
		
						return this;
					},
				

					addAnon: function(child_el_type)
					{
						let child = document.createElementNS(svgNS, child_el_type);
						this.element().appendChild(child);
						return this;
					},
				

					add: function(child_el_type, child_id)
					{
						let child = document.createElementNS(svgNS, child_el_type);
						child.id = child_id;
						this.element().appendChild(child);
						return this;	
					},
				

					defineAnon: function(child_el_type, attr_list)
					{
						let child = document.createElementNS(svgNS, child_el_type);
						_setAttrs(child, attr_list, {nsIsNeeded: true});
						this.element().appendChild(child);
						return this;	
					},
				

					define: function(child_el_type, child_id, attr_list)
					{
						let child = document.createElementNS(svgNS, child_el_type);
						child.id = child_id;
						_setAttrs(child, attr_list, {nsIsNeeded: true});
						this.element().appendChild(child);
						return this;	
					},
				
				};
				
				
				const svgMethods = ds.copyProps([svgBase, svgExtensions]);
			
			
				return svgMethods;

			})(), // end svgType.methods
	

			instance: idStr => ds.copyProps([
				
				idType.instance(idStr),
				
				{_initialStyles: []},
				
			]),
		
		}; // end svgType

		
		
		const built = {
			id: t.typeBuilder().cachingIdType(idType),
			svg: t.typeBuilder().cachingIdType(svgType),
		};
		
		return ds.accessorsEvenForFns(built);

	}; // end _getIdTypes
	
	t.idTypes = () => t.loadOnce(_getIdTypes);
	
	

	
	const _getGeom = () => {
		
		const
			ds = t.ds(),
			svg = t.idTypes().svg();
		
			
		const geom = {

			points: (idStr, pointList) =>
			{
				svg(idStr).attr([
					'points', geom.ptStr(pointList)
				]);
			},
		

			line: (idStr, point0, point1) =>
			{
				svg(idStr).attr([
					'x1', point0[0],
					'y1', point0[1],
					'x2', point1[0],
					'y2', point1[1],
				]);
			},


			/* convert arrays of point pairs i.e. [[x0,y0], [x1,y1], ...]
				to conventional SVG "x0,y0 x1,y1 ..." format */
			ptStr: ptList =>
			{
				let str = '';

				ds.forCount(ptList.length, i => {
					let currentPt = ptList[i];
					str += currentPt[0] + ',' + currentPt[1] + ' ';
				});

				return str;
			},			
	

			pxPt: point => point[0] + 'px ' + point[1] + 'px',

			shiftTo: (x, y) => 'translate(' + x + 'px, ' + y + 'px)',
	
			scaleStr: (x, y) => 'scale(' + x + ', ' + y + ')',
			
		}; // end geom
		
		
		return geom;
		
	}; // end _getGeom
	
	t.geom = () => t.loadOnce(_getGeom);
	

	
	return t;
	
})(tessellations || {});
