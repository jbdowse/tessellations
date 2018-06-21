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
					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var prop = _step.value;

							var shape = svg(idStr);
							shape.addInitialStyleIfNew(prop, shape.element().style[prop]);
						}
					} catch (err) {
						_didIteratorError = true;
						_iteratorError = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion && _iterator.return) {
								_iterator.return();
							}
						} finally {
							if (_didIteratorError) {
								throw _iteratorError;
							}
						}
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

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = ids[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var id = _step2.value;

						this.addElementIfNew(id);

						this.transition({
							start: this.elapsedTime(),
							id: id,
							props: properties,
							vals: newValues,
							transTimes: transTimes
						});
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				var maxTime = ar.arrayMax(transTimes);
				this.wait(maxTime);

				return this;
			},

			show: function show(idStrs, optTransTime) {
				var transTime = optTransTime || 0,
				    idSet = ar.lift(idStrs);

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = idSet[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var id = _step3.value;

						this.addElementIfNew(id);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				this.enqueue(function () {
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = idSet[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var _id = _step4.value;

							svg(_id).on();
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}
				}, this.elapsedTime());

				var _iteratorNormalCompletion5 = true;
				var _didIteratorError5 = false;
				var _iteratorError5 = undefined;

				try {
					for (var _iterator5 = idSet[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
						var _id2 = _step5.value;

						this.transition({
							start: this.elapsedTime(),
							id: _id2,
							props: 'opacity',
							vals: 1,
							transTimes: transTime
						});
					}
				} catch (err) {
					_didIteratorError5 = true;
					_iteratorError5 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion5 && _iterator5.return) {
							_iterator5.return();
						}
					} finally {
						if (_didIteratorError5) {
							throw _iteratorError5;
						}
					}
				}

				this.wait(transTime);

				return this;
			},

			hide: function hide(idStrs, optTransTime) {

				var transTime = optTransTime || 0,
				    idSet = ar.lift(idStrs);

				var _iteratorNormalCompletion6 = true;
				var _didIteratorError6 = false;
				var _iteratorError6 = undefined;

				try {
					for (var _iterator6 = idSet[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
						var id = _step6.value;

						this.addElementIfNew(id);

						this.transition({
							start: this.elapsedTime(),
							id: id,
							props: 'opacity',
							vals: 0,
							transTime: transTime
						});
					}
				} catch (err) {
					_didIteratorError6 = true;
					_iteratorError6 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion6 && _iterator6.return) {
							_iterator6.return();
						}
					} finally {
						if (_didIteratorError6) {
							throw _iteratorError6;
						}
					}
				}

				this.wait(transTime);

				this.enqueue(function () {
					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = idSet[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var _id3 = _step7.value;

							svg(_id3).off();
						}
					} catch (err) {
						_didIteratorError7 = true;
						_iteratorError7 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion7 && _iterator7.return) {
								_iterator7.return();
							}
						} finally {
							if (_didIteratorError7) {
								throw _iteratorError7;
							}
						}
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
					var _iteratorNormalCompletion8 = true;
					var _didIteratorError8 = false;
					var _iteratorError8 = undefined;

					try {
						for (var _iterator8 = _this.animatedElements()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
							var element = _step8.value;

							svg(element).reset();
						}
					} catch (err) {
						_didIteratorError8 = true;
						_iteratorError8 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion8 && _iterator8.return) {
								_iterator8.return();
							}
						} finally {
							if (_didIteratorError8) {
								throw _iteratorError8;
							}
						}
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