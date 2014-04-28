var Animate = (function(doc) {
	"use strict";
	//variables
	var i = 0,
		pArgs = ['top', 'right', 'bottom', 'left', 'height', 'width', 'margin-top', 'margin-right', 'margin-left', 'margin-bottom', 'opacity', 'color'];
	//requires
	var U = require('./util'),
		E = require('./eventManager');
	function animate(element, callback, stop, fn) {
		this.element = element;
		this.style = {};
		for (var i = pArgs.length - 1; i >= 0; --i) {
			this.style[pArgs[i]] = U.getStyle(this.element, pArgs[i]);
		}
		this.callback = callback || false;
		if (stop) {
			var stopFn = function() {
				clearTimeout(this.timeout);
				for (var key in this.args) {		
					if (U.arrayIndexOf(['top', 'right', 'bottom', 'left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'height', 'width'], key)) {
						if (this.args[key]['val']) {
							this.element.style[key] = (parseFloat(this.args[key]['val'], 10)).toString() + 'px';
						}
						else {
							this.element.style[key] = (unit(this.style[key]) + parseFloat(this.args[key]['plus'], 10)).toString() + 'px';
						}
					}
					else if (U.arrayIndexOf(['opacity'], key)) {
						this.element.style[key] = parseFloat((this.style[key]), 10) + parseFloat(this.args[key], 10);
					}
					else if (U.arrayIndexOf(['color'], key)) {
						this.element.backgroundColor = this.arg[key];
					}
				}
				if (typeof(this.callback) === 'function') {
					return this.callback();
					//TODO recursive animate stop -- or just assume user is intelligent enough to not nest animation
				}
				return false;
			};
			E.addEvent(this.element, 'click', stopFn.bind(this));
		}
		//TODO parabolic & bounce types -- I wouldn't try to use this in the meantime
		this.intervalObj = {
			'default': {
				posDimMargin: function(a, q, n) {
					return q / n;
				}
				, color: '(notq/n)'
				, opacity: ''
			},
			'parabolic': {
				posDimMargin: function(a, q, n) {
					return Math.pow(q, 2) * a.timer / n;
				}
				, color: 'r'
				, opacity: 'r'
			},
			'bounce': {
				dimension: 'r'		
			}		
		};
		this.interval = this.intervalObj[fn] || this.intervalObj['default'];
	}
	animate.prototype.animate = function(args, timer, n) {
		this.timer = timer || 750;
		this.args = args;
		n = n || 10;
		if (n >= this.timer) {
			throw new Error('Intervals must be less than the value of the timer');
		}
		if (typeof(this.args) !== 'object') {
			this.args = JSON.stringify(args);
			if (this.args && typeof(this.args) !== 'object') {
				throw new Error('Please provide valid arguments');
			}
		}
		if (this.args['color']) {
			this.endColor = getColor(args['color']);
			this.currentColor = getColor(U.getStyle(this.element, 'background-color'));
		}
		//TODO check if argument is in pArgs, return
		//TODO check if pArgs[argument] is an integer or not!!! make this work with numbers
		this.performAnimation(n);
	};
	animate.prototype.performAnimation = function(n) {
		if (i == n) { 
			i = 0; 
			if (typeof(this.callback) === 'function') {
				return this.callback(); 
			}
			else {
				return;
			}
		}
		for (var key in this.args) {		
			if (U.arrayIndexOf(['top', 'right', 'bottom', 'left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'height', 'width'], key)) {
				posDimMargin(this, this.element, key, getVal(this, key), n);
			}
			else if (U.arrayIndexOf(['opacity'], key)) {
				opacity(this.element, getVal(this, key), n);
			}
			else if (U.arrayIndexOf(['color'], key)) {
				color(this.element
					  , this.endColor.r
					  , this.endColor.g
					  , this.endColor.b
					  , this.currentColor
					  , n);
			}
			else {
				throw new Error('Animation type is not defined');
			}
		}
		i++;
		this.timeout = setTimeout(this.performAnimation.bind(this, n), this.timer / n);
	};		
	animate.prototype.fade = function(disp, n, inline) {
		n = n || 10;
		var interval = disp > 0 ? disp / n * -1 : 1 / n ;
		if (i == n) {
			this.element.style.opacity = '1'; 
			i = 0; 
			if (typeof(this.callback) === 'function') {
				return this.callback(); 
			}
			else {
				return;
			}
		}
		if (i == 0 && disp == 0) {
			this.element.style.display = inline ? 'inline-block' : 'block';
		}
		this.element.style.opacity = (parseFloat((this.element.style.opacity === "" ? disp : this.element.style.opacity), 10) + interval).toString();
		if (i == n - 1 && disp >= 1) {
			this.element.style.display = 'none';
		}
		i++;
		this.timeout = setTimeout(this.fade.bind(this, disp, n, inline), this.timer / n);
	};
	animate.prototype.fadeIn = function(timer, n, inline) {
		this.timer = timer || 750;
		this.element.style.opacity = '0';
		this.fade(0, n, inline);
	};
	animate.prototype.fadeOut = function(timer, n) {
		this.timer = timer || 750;
		this.fade(U.getStyle(this.element, 'opacity'), n);
	};
	function posDimMargin(a, el, dim, q, n) {
		var interval = a.interval.posDimMargin(a, q, n);
		el.style[dim] = (unit(U.getStyle(el, dim)) + interval).toString() + 'px';
		if (i == n - 1) {
			el.style[dim] = (unit(a.style[dim]) + q).toString() + 'px';
		}
	}
	function opacity(el, q, n) {
		var interval = q / n;
		el.style.opacity = (Math.round((parseFloat(U.getStyle(el, 'opacity'), 10) + interval) * 100) / 100).toString();
		//TODO no negatives
	}
	function getVal(a, key) {
		var dim = parseFloat(unit(a.style[key]), 10) || 0;
		if (a.args[key]['plus']) {
			return parseFloat(a.args[key]['plus'], 10);
		}
		else if (a.args[key]['val']) {
			var dist = parseFloat(a.args[key]['val'], 10) - dim;
			return dist;
		}
		else {
			throw new Error('No arguments specified along with animation type');
		}
	}
	function color(el, r, g, b, c, n) {
		var iR = Math.ceil((r - c.r) / n),
			iG = Math.ceil((g - c.g) / n),
			iB = Math.ceil((b - c.b) / n),
			C = getColor(U.getStyle(el, 'background-color'));
		if (el.style.backgroundColor.trim() === '') {
			el.style.backgroundColor = 'rgb(' + C.r.toString() + ',' + C.g.toString() + ',' + C.b.toString() + ')';
		}
		el.style.backgroundColor = 'rgb(' + (C.r + iR).toString() + ',' + (C.g + iG).toString() + ',' + (C.b + iB).toString() + ')';		
	}
	function getColor(a) {
		var r, g, b;
		if (a.match(/^rgb/)) {
	    	a = a.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
	        r = parseInt(a[1], 10);
	        g = parseInt(a[2], 10);
	        b = parseInt(a[3], 10);
	    } 
	    else {
	    	a = +("0x" + a.slice(1).replace(a.length < 5 && /./g, '$&$&'));
	        r = a >> 16;
	        b = a >> 8 & 255;
	        g = a & 255;
	    }
		return {r: r, g: g, b: b};	
	}
	function unit(a) {
		return parseFloat(a.replace(/%|px/g, ''), 10);
	}
	return animate;
}(document));
module.exports = Animate;

//TODO fix dimensioning to zero
//TODO toggle
//TODO slide up down
