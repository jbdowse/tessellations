'use strict';

// Wrappers for DOM elements + utility functions for SVG element definition

var tessellations = function idTypesModule(t) {

	var _getIdTypes = function _getIdTypes() {

		/* tess.svg(idStr) & tess.id(idStr) both return
  wrapped document element with ID idStr, with chainable
  methods as per the prototypes below
  */

		var ar = t.arrays();

		var _setAttrs = function _setAttrs(element, attrList) {
			for (var i = 0; i < attrList.length; i += 2) {
				var attrName = attrList[i];
				var attrValue = attrList[i + 1];

				if (attrName === 'href') {
					// note this is only for SVG elements!
					// so need to revise/split to svg()-specific if href change is needed for non-SVG;
					// this is to fix the bug of dynamically-changed-(xlink:)href <use>s not appearing in Safari
					// see https://github.com/patrick-steele-idem/morphdom/issues/34

					element.setAttributeNS('http://www.w3.org/1999/xlink', attrName, attrValue);
				} else {
					element.setAttribute(attrName, attrValue);
				}
			}
		};

		var _id = {

			proto: {

				id: function id() {
					return this._id;
				},

				// access to the unwrapped DOM element -
				// need to make _element an instance var:
				element: function element() {
					return this._element;
				},

				tag: function tag(className) {
					this.element().classList.add(className);
					return this;
				},

				untag: function untag(className) {
					this.element().classList.remove(className);
					return this;
				},

				listen: function listen(event_type, func) {
					this.element().addEventListener(event_type, func);
					return this;
				},

				attr: function attr(attr_list) {
					_setAttrs(this.element(), attr_list);
					return this;
				},

				html: function html(contents) {
					this.element().innerHTML = contents;
					return this;
				},

				style: function style(property, value) {
					this.element().style[property] = value;
					// console.log('style(): ' + this.id() + ' ' + property + ' changed to ' + value);
					return this;
				}

			}, // end _id.proto


			addInstanceVars: function addInstanceVars(newObj, idStr) {
				newObj._id = idStr;
				newObj._element = document.getElementById(idStr);
			}

		}; // end _id


		var _svg = {

			proto: function svgProto() {

				var svgNS = 'http://www.w3.org/2000/svg',
				    idp = _id.proto;

				var _svgProto = {

					id: idp.id,

					element: idp.element,

					style: idp.style,

					tag: idp.tag,

					untag: idp.untag,

					listen: idp.listen,

					attr: idp.attr,

					on: function on() {
						this.style('display', 'block');
						return this;
					},

					off: function off() {
						this.style('display', 'none');
						return this;
					},

					initialStyles: function initialStyles() {
						return this._initialStyles;
					},

					// need to make _initialStyles = [] an instance var:
					addInitialStyleIfNew: function addInitialStyleIfNew(prop, val) {
						var propIndex = ar.indexOfKey(this.initialStyles(), 'property', prop);

						var propIsNew = -1 === propIndex;

						ar.addIfPredicate(this._initialStyles, { property: prop, value: val }, propIsNew);

						return this;
					},

					initStyle: function initStyle(prop, val) {
						this.addInitialStyleIfNew(prop, val).style(prop, val);

						return this;
					},

					reset: function reset() {
						var _this = this;

						ar.forEachOf(this.initialStyles(), function (initialStyle) {
							_this.style(initialStyle.property, initialStyle.value);
						});

						this.style('display', 'none').style('transitionProperty', '').style('transitionDuration', '');

						return this;
					},

					addAnon: function addAnon(child_el_type) {
						var child = document.createElementNS(svgNS, child_el_type);
						this.element().appendChild(child);
						return this;
					},

					add: function add(child_el_type, child_id) {
						var child = document.createElementNS(svgNS, child_el_type);
						child.id = child_id;
						this.element().appendChild(child);
						return this;
					},

					defineAnon: function defineAnon(child_el_type, attr_list) {
						var child = document.createElementNS(svgNS, child_el_type);
						_setAttrs(child, attr_list);
						this.element().appendChild(child);
						return this;
					},

					define: function define(child_el_type, child_id, attr_list) {
						var child = document.createElementNS(svgNS, child_el_type);
						child.id = child_id;
						_setAttrs(child, attr_list);
						this.element().appendChild(child);
						return this;
					}

				};

				return _svgProto;
			}(), // end _svg.proto


			addInstanceVars: function addInstanceVars(newObj, idStr) {
				_id.addInstanceVars(newObj, idStr);
				newObj._initialStyles = [];
			}

		}; // end _svg


		var built = {
			id: t.buildType().cachingIdType(_id),
			svg: t.buildType().cachingIdType(_svg)
		};

		return {
			id: function id() {
				return built.id;
			},
			svg: function svg() {
				return built.svg;
			}
		};
	}; // end _getIdTypes

	t.idTypes = function () {
		return t.loadOnce(_getIdTypes);
	};

	var _getGeom = function _getGeom() {

		var ar = t.arrays(),
		    svg = t.idTypes().svg();

		var geom = {

			points: function points(idStr, pointList) {
				svg(idStr).attr(['points', geom.ptStr(pointList)]);
			},

			line: function line(idStr, point0, point1) {
				svg(idStr).attr(['x1', point0[0], 'y1', point0[1], 'x2', point1[0], 'y2', point1[1]]);
			},

			/* convert arrays of point pairs i.e. [[x0,y0], [x1,y1], ...]
   	to conventional SVG "x0,y0 x1,y1 ..." format */
			ptStr: function ptStr(ptList) {
				var str = '';

				ar.forCount(ptList.length, function (i) {
					var currentPt = ptList[i];
					str += currentPt[0] + ',' + currentPt[1] + ' ';
				});

				return str;
			},

			pxPt: function pxPt(point) {
				return point[0] + 'px ' + point[1] + 'px';
			},

			shiftTo: function shiftTo(x, y) {
				return 'translate(' + x + 'px, ' + y + 'px)';
			},

			scaleStr: function scaleStr(x, y) {
				return 'scale(' + x + ', ' + y + ')';
			}

		}; // end geom


		return geom;
	}; // end _getGeom

	t.geom = function () {
		return t.loadOnce(_getGeom);
	};

	return t;
}(tessellations || {});