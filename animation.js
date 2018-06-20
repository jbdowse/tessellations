// All time-changing functionality 

var tessellations = tessellations || {};
tessellations.load = tessellations.load || {};


tessellations.load.animation = (function loadAnimation()
{
	const t = tessellations;
	
	let loaded = false;
	
	
	const loadModule = () =>
	{
		t.load
		.arrays()
		.idTypes();
		
		const
			svg = t.svg,
			ar = t.arrays,
			cap = t.id('caption'),
			titleCap = t.id('demo1-title');


		const _ut = (() => // "utility"
		{
			const _t = { // "times"
				transDelay_s: 0.02,
				captionTransTime: 500,
				changeDelay: 50,
				showDelay: 50,
			}
			
			_t.transDelay_ms = _t.transDelay_s * 1000;
			_t.changeTime = _t.captionTransTime + _t.changeDelay;
			_t.showTime = _t.changeTime + _t.showDelay;
				
			
			const _reduceTime = time =>
			{
				reducedTime = Math.max(time - _t.transDelay_s, 0);
				return reducedTime + 's';
			};
			
	
			return {
		
				transDelay_ms: _t.transDelay_ms,

				reduceTimes: fullTimes => fullTimes.map(_reduceTime),

				addAnyInitialStylesIfChanging: (idStr, props) =>
				{
					for (const prop of props)
					{
						const shape = svg(idStr);
						shape.addInitialStyleIfNew(prop, shape.element().style[prop]);
					}
				},

				captionTiming: {
					
					change: () => _t.changeTime,
					
					show: () => _t.showTime,
					
				},
			};
		
		})(); // end _ut
	
	
		const _animation = {};
	
	
		_animation.proto = {
			
			/* retaining full function syntax here as arrows don't work in same way with (this) -
			except using arrows for unnamed func args of enqueue() because they either don't use (this)
			or previously had to use (that) instead
			*/
			
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


			enqueue: function(func, time)
			{
				this.actions().push(() => {
					return window.setTimeout(func, time);
				});
		
				return this;
			},
	
	
			addElementIfNew: function(idStr)
			{
				ar.addIfNew(this.animatedElements(), idStr);
				svg(idStr).style('transitionTimingFunction', 'linear');
			},


			to: function(idStrs, properties, newValues, transTimes)
			{
				const ids = ar.lift(idStrs);
		
				for (id of ids)
				{
					this.addElementIfNew(id);
					
					this.transition({
						start: this.elapsedTime(),
						id: id,
						props: properties,
						vals: newValues,
						transTimes: transTimes,
					});
				}
	
				const maxTime = ar.arrayMax(transTimes);
				this.wait(maxTime);
	
				return this;
			},


			show: function(idStrs, optTransTime)
			{
				const
					transTime = optTransTime || 0,
					idSet = ar.lift(idStrs);
				
				for (id of idSet) {
					this.addElementIfNew(id);
				}
		
				this.enqueue(() =>
				{
					for (id of idSet) {
						svg(id).on();
					}
				},
				this.elapsedTime());
	
				for (id of idSet)
				{
					this.transition({
						start: this.elapsedTime(),
						id: id,
						props: 'opacity',
						vals: 1,
						transTimes: transTime,
					});
				}
	
				this.wait(transTime);
				
				return this;
			},


			hide: function(idStrs, optTransTime) {
		
				const
					transTime = optTransTime || 0,
					idSet = ar.lift(idStrs);
		
				for (id of idSet)
				{
					this.addElementIfNew(id);
					
					this.transition({
						start: this.elapsedTime(),
						id: id,
						props: 'opacity',
						vals: 0,
						transTime: transTime,
					});
				}
	
				this.wait(transTime);
	
				this.enqueue(() =>
				{
					for (id of idSet) {
						svg(id).off();
					}
				},
				this.elapsedTime());
	
				return this;
			},


			on: function(idStr) {
		
				this.addElementIfNew(idStr);
	
				this.enqueue(() =>
				{
					svg(idStr).on();
				},
				this.elapsedTime());
	
				return this;
			},


			caption: function(str) {
		
				const time = this.elapsedTime();
		
				this.enqueue( function hideCaption()
				{
					cap.style('opacity', 0);
				},
				time);
	
				this.enqueue( function changeCaptionText()
				{
					cap.html(str);
					titleCap.html(str);
				},
				time + _ut.captionTiming.change() );
	
				this.enqueue( function fadeInCaption()
				{
					cap.style('opacity', 1);
				},
				time + _ut.captionTiming.show() );

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


			end: function()
			{
				// this in inner arrow fn should refer to this object:
				
				this.enqueue(() =>
				{
					for (const element of this.animatedElements()) {
						svg(element).reset();
					}
					t.player.end();
				},
				this.elapsedTime());
		
				return this;
			},


			transition: function(trans) // trans = object incl. {start, id, props, vals, transTimes}
			{
				const
					propSet = ar.lift(trans.props),
					valSet = ar.lift(trans.vals),
					transTimeSet = ar.lift(trans.transTimes),
					reducedTimeSet = _ut.reduceTimes(transTimeSet),
					reducedTimesList = ar.csv(reducedTimeSet),
					propsList =  ar.csv(propSet);
		
				_ut.addAnyInitialStylesIfChanging(trans.id, propSet);
		
				this.enqueue(() =>
				{
					svg(trans.id).style('transitionDuration', reducedTimesList);
					svg(trans.id).style('transitionProperty', propsList);
				},
				trans.start);
		
				this.enqueue(() =>
				{
					for (let i = 0; i < propSet.length; ++i) {
						svg(trans.id).style(propSet[i], valSet[i]);
					}
				},
				trans.start + _ut.transDelay_ms);
	
				return this;
			},
			
		}; // end _animation.proto
	
	
		_animation.addInstanceVars = newObj => {
			newObj._actions = [];
			newObj._animatedElements = [];
			newObj._elapsedTime = 0;
		};
	
	
		t.animation = t.buildType.basic(_animation);

	}; // end loadModule
	
	
	return function loadOnce() {
		
		if (! loaded) {
			loadModule();
			loaded = true;
		}
	
		return t.load;
	};

})(); // end t.load.animation


