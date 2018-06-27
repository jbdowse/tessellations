// All time-changing functionality 

var tessellations = (function animationModule(t)
{
	
	const _getAnimation = () => 
	{
		
		const
			svg = t.idTypes().svg(),
			getId = t.idTypes().id(),
			ds = t.ds(),
			cap = getId('caption'),
			titleCap = getId('demo0-title');


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
				const reducedTime = Math.max(time - _t.transDelay_s, 0);
				return reducedTime + 's';
			};
		

			return {
	
				transDelay_ms: _t.transDelay_ms,

				reduceTimes: fullTimes => fullTimes.map(_reduceTime),

				addAnyInitialStylesIfChanging: (idStr, props) =>
				{
					ds.forEachOf(props, prop =>
					{
						const shape = svg(idStr);
						shape.addInitialStyleIfNew(prop, shape.element().style[prop]);
					});
				},

				captionTiming: {
				
					change: () => _t.changeTime,
				
					show: () => _t.showTime,
				
				},
			};
	
		})(); // end _ut


		const Animation = {};


		Animation.methods = {
		
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
				ds.addIfNew(this.animatedElements(), idStr);
				svg(idStr).style('transitionTimingFunction', 'linear');
				
				return this;
			},


			to: function(idStrs, properties, newValues, transTimes)
			{
				const ids = ds.lift(idStrs);
	
				ds.forEachOf(ids, id =>
				{
					this.addElementIfNew(id);
				
					this.transition({
						start: this.elapsedTime(),
						id: id,
						props: properties,
						vals: newValues,
						transTimes: transTimes,
					});
				});

				const maxTime = ds.arrayMax(transTimes);
				this.wait(maxTime);

				return this;
			},


			show: function(idStrs, optTransTime)
			{
				const
					transTime = optTransTime || 0,
					idSet = ds.lift(idStrs);
			
				ds.forEachOf(idSet, id => {
					this.addElementIfNew(id);
				});
	
				this.enqueue(
					() => {
						ds.forEachOf(idSet, id => {
							svg(id).on();
						});
					},
					this.elapsedTime()
				);

				ds.forEachOf(idSet, id =>
				{
					this.transition({
						start: this.elapsedTime(),
						id: id,
						props: 'opacity',
						vals: 1,
						transTimes: transTime,
					});
				});

				this.wait(transTime);
			
				return this;
			},


			hide: function(idStrs, optTransTime) {
	
				const
					transTime = optTransTime || 0,
					idSet = ds.lift(idStrs);
	
				ds.forEachOf(idSet, id =>
				{
					this.addElementIfNew(id);
				
					this.transition({
						start: this.elapsedTime(),
						id: id,
						props: 'opacity',
						vals: 0,
						transTime: transTime,
					});
				})

				this.wait(transTime);

				this.enqueue(
					() => {
						ds.forEachOf(idSet, id => {
							svg(id).off();
						});
					},
					this.elapsedTime()
				);

				return this;
			},


			on: function(idStr) {
	
				this.addElementIfNew(idStr);

				this.enqueue(
					() => {
						svg(idStr).on();
					},
					this.elapsedTime()
				);

				return this;
			},


			caption: function(str) {
	
				const time = this.elapsedTime();
	
				this.enqueue(
					function hideCaption() {
						cap.style('opacity', 0);
					},
					time
				);

				this.enqueue(
					function changeCaptionText() {
						cap.html(str);
						titleCap.html(str);
					},
					time + _ut.captionTiming.change()
				);

				this.enqueue(
					function fadeInCaption() {
						cap.style('opacity', 1);
					},
					time + _ut.captionTiming.show()
				);

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
			
				this.enqueue(
					() => {
						ds.forEachOf(this.animatedElements(), element =>
						{
							svg(element).reset();
						});
				
						t.player().end();
					},
					this.elapsedTime()
				);
	
				return this;
			},


			// param trans = object incl. {start, id, props, vals, transTimes}
			transition: function(trans)
			{
				const
					propSet = ds.lift(trans.props),
					valSet = ds.lift(trans.vals),
					transTimeSet = ds.lift(trans.transTimes),
					reducedTimeSet = _ut.reduceTimes(transTimeSet),
					reducedTimesList = ds.csv(reducedTimeSet),
					propsList =  ds.csv(propSet);
	
				_ut.addAnyInitialStylesIfChanging(trans.id, propSet);
	
				this.enqueue(
					() => {
						svg(trans.id).style('transitionDuration', reducedTimesList);
						svg(trans.id).style('transitionProperty', propsList);
					},
					trans.start
				);
	
				this.enqueue(
					() => {
						ds.forCount(propSet.length, i => {
							svg(trans.id).style(propSet[i], valSet[i]);
						});
					},
					trans.start + _ut.transDelay_ms
				);

				return this;
			},
		
		}; // end animation.methods


		Animation.instance = () => ({
			
			_actions: [],
			
			_animatedElements: [],
			
			_elapsedTime: 0,
			
		});


		return t.typeBuilder().basic(Animation);

	}; // end _getAnimation
	
	// double call here in order to let t.Animation act as a ctor
	t.Animation = () => t.loadOnce(_getAnimation)();
	
	
	return t;
	
})(tessellations || {});
