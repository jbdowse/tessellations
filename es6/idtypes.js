// Wrappers for DOM elements + utility functions for SVG element definition

var tessellations = (function idTypesModule(t)
{

	const _getIdTypes = () => {	

		/* tess.svg(idStr) & tess.id(idStr) both return
		wrapped document element with ID idStr, with chainable
		methods as per the prototypes below
		*/
	
		const ar = t.arrays();


		const _setAttrs = (element, attrList) =>
		{
			for (let i = 0; i < attrList.length; i += 2)
			{
				let attrName = attrList[i];
				let attrValue = attrList[i + 1];
		
				if (attrName === 'href') {
					// note this is only for SVG elements!
					// so need to revise/split to svg()-specific if href change is needed for non-SVG;
					// this is to fix the bug of dynamically-changed-(xlink:)href <use>s not appearing in Safari
					// see https://github.com/patrick-steele-idem/morphdom/issues/34
			
					element.setAttributeNS('http://www.w3.org/1999/xlink', attrName, attrValue);
				}
				else {
					element.setAttribute(attrName, attrValue);
				}
			}
		};

	
		const _id = {

			proto: {

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
					this.element().addEventListener(event_type, func);
					return this;
				},

				attr: function(attr_list) {
					_setAttrs(this.element(), attr_list);
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
			
			}, // end _id.proto
	
	
			addInstanceVars: (newObj, idStr) =>
			{
				newObj._id = idStr;
				newObj._element = document.getElementById(idStr);
			},
	
		}; // end _id


		const _svg = {

			proto: (function svgProto()
			{

				const
					svgNS = 'http://www.w3.org/2000/svg',
					idp = _id.proto;


				const _svgProto = {
	
					id: idp.id,

					element: idp.element,
	
					style: idp.style,

					tag: idp.tag,

					untag: idp.untag,

					listen: idp.listen,

					attr: idp.attr,
	
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
						const propIndex = ar.indexOfKey(
							this.initialStyles(), 'property', prop);
					
						const propIsNew = (-1 === propIndex);
		
						ar.addIfPredicate(
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
						ar.forEachOf(this.initialStyles(), initialStyle =>
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
						_setAttrs(child, attr_list);
						this.element().appendChild(child);
						return this;	
					},
				

					define: function(child_el_type, child_id, attr_list)
					{
						let child = document.createElementNS(svgNS, child_el_type);
						child.id = child_id;
						_setAttrs(child, attr_list);
						this.element().appendChild(child);
						return this;	
					},
				
				};
			
			
				return _svgProto;

			})(), // end _svg.proto
	

			addInstanceVars: (newObj, idStr) => {
				_id.addInstanceVars(newObj, idStr);
				newObj._initialStyles = [];
			},
		
		}; // end _svg

		
		
		const built = {
			id: t.buildType().cachingIdType(_id),
			svg: t.buildType().cachingIdType(_svg),
		};
		
		return {
			id: () => built.id,
			svg: () => built.svg,
		};

	}; // end _getIdTypes
	
	t.idTypes = () => t.loadOnce(_getIdTypes);
	
	

	
	const _getGeom = () => {
		
		const svg = t.idTypes().svg();
		
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

				for (let i = 0; i < ptList.length; ++i) {
					let currentPt = ptList[i];
					str += currentPt[0] + ',' + currentPt[1] + ' ';
				}

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
