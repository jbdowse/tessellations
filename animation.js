// All time-changing functionality 

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};


tessellations.load.animation = function() {
	
	const t = tessellations;
	const svg = t.svg;
	const ar = t.arrays;
	const cap = t.id('caption');


	const _ = (function animationPrivIIFE() {
		
		const transDelay_s = 0.02;

		const captionTransTime = function() {
			// cap.element().style.transitionDuration = '1s';
			/*const timeStr = cap.element().style.transitionDuration;
			// console.log(cap.element().style.transitionDuration);
			const numStr = timeStr.substr(0, timeStr.length - 1);
			console.log(Number(numStr));
			return 1000 * Number(numStr);*/ // convert to ms
	
			/* fallback: */
			return 500;
		};
	
		return {
		
			transDelay_ms: transDelay_s * 1000,

			reduceTimes: function(fullTimes) {
				// could of course do this with map too
				const reducedTimes = [];
				for (const time of fullTimes) {
					reducedTime = Math.max(time - transDelay_s, 0);
					reducedTimes.push( reducedTime + 's' );
				}
				return reducedTimes;
			},

			addAnyInitialStylesIfChanging: function(idStr, props) {
				for (prop of props) {
					const shape = svg(idStr);
					shape.addInitialStyleIfNew(prop, shape.element().style[prop]);
				}
			},

			captionTiming: (function(){
	
				const changeDelay = 50;
				const changeTime = captionTransTime() + changeDelay;
	
				const showDelay = 50;
				const showTime = changeTime + showDelay;
	
				return {
					change: function() { return changeTime; },
					show: function() { return showTime; }
				};
	
			})()
		};
		
	})();
	
	
	const _animation = {};
	
	
	_animation.proto = {
	
		// instance var _actions = []
		actions: function() {
			return this._actions;
		},
	
		// instance var _animatedElements = [] as well
		animatedElements: function() {
			return this._animatedElements;
		},
	
		// instance var _elapsedTime = 0
		elapsedTime: function() {
			return this._elapsedTime;
		},

		enqueue: function(func, time) {
			this.actions().push( function() {
				return window.setTimeout(func, time);
			});
		
			return this;
		},
	
		addElementIfNew: function(idStr) {
			ar.addIfNew(this.animatedElements(), idStr);
			svg(idStr).style('transitionTimingFunction', 'linear');
		},

		to: function(idStrs, properties, newValues, transTimes) {
	
			const ids = ar.lift(idStrs);
		
			for (id of ids) {
				this.addElementIfNew(id);
				this.transition(this.elapsedTime(), id, properties, newValues, transTimes);
			}
	
			const maxTime = ar.arrayMax(transTimes);
			this.wait(maxTime);
	
			return this;
		},

		show: function(idStrs, optTransTime) {
		
			const transTime = optTransTime || 0;
			const idSet = ar.lift(idStrs);
			for (id of idSet) {
				this.addElementIfNew(id);
			}
		
			this.enqueue(function() {
				for (id of idSet) {
					svg(id).on();
				}
			}, this.elapsedTime());
	
			for (id of idSet) {
				this.transition(this.elapsedTime(), id, 'opacity', 1, transTime);
			}
	
			this.wait(transTime);
			return this;
		},

		hide: function(idStrs, optTransTime) {
		
			const transTime = optTransTime || 0;
			const idSet = ar.lift(idStrs);
		
			for (id of idSet) {
				this.addElementIfNew(id);
				this.transition(this.elapsedTime(), id, 'opacity', 0, transTime);
			}
	
			this.wait(transTime);
	
			this.enqueue(function() {
				for (id of idSet) {
					svg(id).off();
				}
			}, this.elapsedTime());
	
			return this;
		},

		on: function(idStr) {
		
			this.addElementIfNew(idStr);
	
			this.enqueue(function() {
				svg(idStr).on();
			}, this.elapsedTime());
	
			return this;
		},

		caption: function(str) {
		
			const time = this.elapsedTime();
		
			this.enqueue(function hideCaption() {
				cap.style('opacity', 0);
			}, time);
	
			this.enqueue( function changeCaptionText() {
				cap.html(str);
			}, time + _.captionTiming.change() );
	
			this.enqueue( function fadeInCaption() {
				cap.style('opacity', 1);
			}, time + _.captionTiming.show() );

			return this;
		},

		wait: function(time) {
			this._elapsedTime += time * 1000; // convert s to ms
			return this;
		},

		rewind: function(time) {
			this._elapsedTime -= time * 1000;
			return this;
		},

		end: function() {
		
			let that = this;
			this.enqueue(function() {
				for (element of that.animatedElements()) {
					svg(element).reset();
				}
				t.player.end();
			}, this.elapsedTime());
		
			return this;
		},

		transition: function(startTime, idStr, properties, newValues, transTimes) {
		
			const propSet = ar.lift(properties);
			const valSet = ar.lift(newValues);
			const transTimeSet = ar.lift(transTimes);
			const reducedTimeSet = _.reduceTimes(transTimeSet);
		
			_.addAnyInitialStylesIfChanging(idStr, propSet);
		
			this.enqueue(function() {
				svg(idStr).style('transitionDuration', ar.csv(reducedTimeSet) );
				svg(idStr).style('transitionProperty', ar.csv(propSet) );
			}, startTime);
		
			this.enqueue(function() {
				for (let i = 0; i < propSet.length; ++i) {
					svg(idStr).style(propSet[i], valSet[i]);
				}
			}, startTime + _.transDelay_ms);
	
			return this;
		}
	};
	
	
	_animation.addInstanceVars = function(newObj) {
		newObj._actions = [];
		newObj._animatedElements = [];
		newObj._elapsedTime = 0;
	};
	
	
	t.animation = t.buildType.basic(_animation);
	
	return t.load;

};
