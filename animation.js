'use strict';

// All time-changing functionality 

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};

tessellations.load.animation = function loadAnimation() {
	var t = tessellations;

	var loaded = false;

	var loadModule = function loadModule() {
		t.load.arrays().idTypes();

		var svg = t.svg,
		    ar = t.arrays,
		    cap = t.id('caption'),
		    titleCap = t.id('demo1-title');

		var _ut = function () // "utility"
		{
			var _t = { // "times"
				transDelay_s: 0.02,
				captionTransTime: 500,
				changeDelay: 50,
				showDelay: 50
			};

			_t.transDelay_ms = _t.transDelay_s * 1000;
			_t.changeTime = _t.captionTransTime + _t.changeDelay;
			_t.showTime = _t.changeTime + _t.showDelay;

			var _reduceTime = function _reduceTime(time) {
				var reducedTime = Math.max(time - _t.transDelay_s, 0);
				return reducedTime + 's';
			};

			return {

				transDelay_ms: _t.transDelay_ms,

				reduceTimes: function reduceTimes(fullTimes) {
					return fullTimes.map(_reduceTime);
				},

				addAnyInitialStylesIfChanging: function addAnyInitialStylesIfChanging(idStr, props) {
					for (var _iterator = props, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
						var _ref;

						if (_isArray) {
							if (_i >= _iterator.length) break;
							_ref = _iterator[_i++];
						} else {
							_i = _iterator.next();
							if (_i.done) break;
							_ref = _i.value;
						}

						var prop = _ref;

						var shape = svg(idStr);
						shape.addInitialStyleIfNew(prop, shape.element().style[prop]);
					}
				},

				captionTiming: {

					change: function change() {
						return _t.changeTime;
					},

					show: function show() {
						return _t.showTime;
					}

				}
			};
		}(); // end _ut


		var _animation = {};

		_animation.proto = {

			/* retaining full function syntax here as arrows don't work in same way with (this) -
   except using arrows for unnamed func args of enqueue() because they either don't use (this)
   or previously had to use (that) instead
   */

			// instance var _actions = []
			actions: function actions() {
				return this._actions;
			},

			// instance var _animatedElements = [] as well
			animatedElements: function animatedElements() {
				return this._animatedElements;
			},

			// instance var _elapsedTime = 0
			elapsedTime: function elapsedTime() {
				return this._elapsedTime;
			},

			enqueue: function enqueue(func, time) {
				this.actions().push(function () {
					return window.setTimeout(func, time);
				});

				return this;
			},

			addElementIfNew: function addElementIfNew(idStr) {
				ar.addIfNew(this.animatedElements(), idStr);
				svg(idStr).style('transitionTimingFunction', 'linear');
			},

			to: function to(idStrs, properties, newValues, transTimes) {
				var ids = ar.lift(idStrs);

				for (var _iterator2 = ids, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
					var _ref2;

					if (_isArray2) {
						if (_i2 >= _iterator2.length) break;
						_ref2 = _iterator2[_i2++];
					} else {
						_i2 = _iterator2.next();
						if (_i2.done) break;
						_ref2 = _i2.value;
					}

					var id = _ref2;

					this.addElementIfNew(id);

					this.transition({
						start: this.elapsedTime(),
						id: id,
						props: properties,
						vals: newValues,
						transTimes: transTimes
					});
				}

				var maxTime = ar.arrayMax(transTimes);
				this.wait(maxTime);

				return this;
			},

			show: function show(idStrs, optTransTime) {
				var transTime = optTransTime || 0,
				    idSet = ar.lift(idStrs);

				for (var _iterator3 = idSet, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
					var _ref3;

					if (_isArray3) {
						if (_i3 >= _iterator3.length) break;
						_ref3 = _iterator3[_i3++];
					} else {
						_i3 = _iterator3.next();
						if (_i3.done) break;
						_ref3 = _i3.value;
					}

					var id = _ref3;

					this.addElementIfNew(id);
				}

				this.enqueue(function () {
					for (var _iterator4 = idSet, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
						var _ref4;

						if (_isArray4) {
							if (_i4 >= _iterator4.length) break;
							_ref4 = _iterator4[_i4++];
						} else {
							_i4 = _iterator4.next();
							if (_i4.done) break;
							_ref4 = _i4.value;
						}

						var id = _ref4;

						svg(id).on();
					}
				}, this.elapsedTime());

				for (var _iterator5 = idSet, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
					var _ref5;

					if (_isArray5) {
						if (_i5 >= _iterator5.length) break;
						_ref5 = _iterator5[_i5++];
					} else {
						_i5 = _iterator5.next();
						if (_i5.done) break;
						_ref5 = _i5.value;
					}

					var _id = _ref5;

					this.transition({
						start: this.elapsedTime(),
						id: _id,
						props: 'opacity',
						vals: 1,
						transTimes: transTime
					});
				}

				this.wait(transTime);

				return this;
			},

			hide: function hide(idStrs, optTransTime) {

				var transTime = optTransTime || 0,
				    idSet = ar.lift(idStrs);

				for (var _iterator6 = idSet, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
					var _ref6;

					if (_isArray6) {
						if (_i6 >= _iterator6.length) break;
						_ref6 = _iterator6[_i6++];
					} else {
						_i6 = _iterator6.next();
						if (_i6.done) break;
						_ref6 = _i6.value;
					}

					var id = _ref6;

					this.addElementIfNew(id);

					this.transition({
						start: this.elapsedTime(),
						id: id,
						props: 'opacity',
						vals: 0,
						transTime: transTime
					});
				}

				this.wait(transTime);

				this.enqueue(function () {
					for (var _iterator7 = idSet, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
						var _ref7;

						if (_isArray7) {
							if (_i7 >= _iterator7.length) break;
							_ref7 = _iterator7[_i7++];
						} else {
							_i7 = _iterator7.next();
							if (_i7.done) break;
							_ref7 = _i7.value;
						}

						var id = _ref7;

						svg(id).off();
					}
				}, this.elapsedTime());

				return this;
			},

			on: function on(idStr) {

				this.addElementIfNew(idStr);

				this.enqueue(function () {
					svg(idStr).on();
				}, this.elapsedTime());

				return this;
			},

			caption: function caption(str) {

				var time = this.elapsedTime();

				this.enqueue(function hideCaption() {
					cap.style('opacity', 0);
				}, time);

				this.enqueue(function changeCaptionText() {
					cap.html(str);
					titleCap.html(str);
				}, time + _ut.captionTiming.change());

				this.enqueue(function fadeInCaption() {
					cap.style('opacity', 1);
				}, time + _ut.captionTiming.show());

				return this;
			},

			wait: function wait(time) {
				this._elapsedTime += time * 1000; // convert s to ms
				return this;
			},

			rewind: function rewind(time) {
				this._elapsedTime -= time * 1000;
				return this;
			},

			end: function end() {
				var _this = this;

				// this in inner arrow fn should refer to this object:

				this.enqueue(function () {
					for (var _iterator8 = _this.animatedElements(), _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
						var _ref8;

						if (_isArray8) {
							if (_i8 >= _iterator8.length) break;
							_ref8 = _iterator8[_i8++];
						} else {
							_i8 = _iterator8.next();
							if (_i8.done) break;
							_ref8 = _i8.value;
						}

						var element = _ref8;

						svg(element).reset();
					}
					t.player.end();
				}, this.elapsedTime());

				return this;
			},

			transition: function transition(trans) // trans = object incl. {start, id, props, vals, transTimes}
			{
				var propSet = ar.lift(trans.props),
				    valSet = ar.lift(trans.vals),
				    transTimeSet = ar.lift(trans.transTimes),
				    reducedTimeSet = _ut.reduceTimes(transTimeSet),
				    reducedTimesList = ar.csv(reducedTimeSet),
				    propsList = ar.csv(propSet);

				_ut.addAnyInitialStylesIfChanging(trans.id, propSet);

				this.enqueue(function () {
					svg(trans.id).style('transitionDuration', reducedTimesList);
					svg(trans.id).style('transitionProperty', propsList);
				}, trans.start);

				this.enqueue(function () {
					for (var i = 0; i < propSet.length; ++i) {
						svg(trans.id).style(propSet[i], valSet[i]);
					}
				}, trans.start + _ut.transDelay_ms);

				return this;
			}

		}; // end _animation.proto


		_animation.addInstanceVars = function (newObj) {
			newObj._actions = [];
			newObj._animatedElements = [];
			newObj._elapsedTime = 0;
		};

		t.animation = t.buildType.basic(_animation);
	}; // end loadModule


	return function loadOnce() {

		if (!loaded) {
			loadModule();
			loaded = true;
		}

		return t.load;
	};
}(); // end t.load.animation