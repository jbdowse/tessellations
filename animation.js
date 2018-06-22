'use strict';

// All time-changing functionality 

var tessellations = function animationModule(t) {

	var _getAnimation = function _getAnimation() {

		var svg = t.idTypes().svg(),
		    getId = t.idTypes().id(),
		    ar = t.arrays(),
		    cap = getId('caption'),
		    titleCap = getId('demo0-title');

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
					ar.forEachOf(props, function (prop) {
						var shape = svg(idStr);
						shape.addInitialStyleIfNew(prop, shape.element().style[prop]);
					});
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

				return this;
			},

			to: function to(idStrs, properties, newValues, transTimes) {
				var _this = this;

				var ids = ar.lift(idStrs);

				ar.forEachOf(ids, function (id) {
					_this.addElementIfNew(id);

					_this.transition({
						start: _this.elapsedTime(),
						id: id,
						props: properties,
						vals: newValues,
						transTimes: transTimes
					});
				});

				var maxTime = ar.arrayMax(transTimes);
				this.wait(maxTime);

				return this;
			},

			show: function show(idStrs, optTransTime) {
				var _this2 = this;

				var transTime = optTransTime || 0,
				    idSet = ar.lift(idStrs);

				ar.forEachOf(idSet, function (id) {
					_this2.addElementIfNew(id);
				});

				this.enqueue(function () {
					ar.forEachOf(idSet, function (id) {
						svg(id).on();
					});
				}, this.elapsedTime());

				ar.forEachOf(idSet, function (id) {
					_this2.transition({
						start: _this2.elapsedTime(),
						id: id,
						props: 'opacity',
						vals: 1,
						transTimes: transTime
					});
				});

				this.wait(transTime);

				return this;
			},

			hide: function hide(idStrs, optTransTime) {
				var _this3 = this;

				var transTime = optTransTime || 0,
				    idSet = ar.lift(idStrs);

				ar.forEachOf(idSet, function (id) {
					_this3.addElementIfNew(id);

					_this3.transition({
						start: _this3.elapsedTime(),
						id: id,
						props: 'opacity',
						vals: 0,
						transTime: transTime
					});
				});

				this.wait(transTime);

				this.enqueue(function () {
					ar.forEachOf(idSet, function (id) {
						svg(id).off();
					});
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
				var _this4 = this;

				// this in inner arrow fn should refer to this object:

				this.enqueue(function () {
					ar.forEachOf(_this4.animatedElements(), function (element) {
						svg(element).reset();
					});

					t.player().end();
				}, this.elapsedTime());

				return this;
			},

			// param trans = object incl. {start, id, props, vals, transTimes}
			transition: function transition(trans) {
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

		var animationCtor = t.buildType().basic(_animation);

		return {
			init: animationCtor
		};
	}; // end _getAnimation

	t.animation = function () {
		return t.loadOnce(_getAnimation);
	};

	return t;
}(tessellations || {});