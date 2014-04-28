(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                throw new Error("Cannot find module '" + o + "'");
            }
            var f = n[o] = {
                exports: {}
            };
            t[o][0].call(f.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})({
    1: [ function(require, module, exports) {
        var Animate = function(doc) {
            "use strict";
            var i = 0, pArgs = [ "top", "right", "bottom", "left", "height", "width", "margin-top", "margin-right", "margin-left", "margin-bottom", "opacity", "color" ];
            var U = require("./util"), E = require("./eventManager");
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
                            if (U.arrayIndexOf([ "top", "right", "bottom", "left", "margin-top", "margin-right", "margin-bottom", "margin-left", "height", "width" ], key)) {
                                if (this.args[key]["val"]) {
                                    this.element.style[key] = parseFloat(this.args[key]["val"], 10).toString() + "px";
                                } else {
                                    this.element.style[key] = (unit(this.style[key]) + parseFloat(this.args[key]["plus"], 10)).toString() + "px";
                                }
                            } else if (U.arrayIndexOf([ "opacity" ], key)) {
                                this.element.style[key] = parseFloat(this.style[key], 10) + parseFloat(this.args[key], 10);
                            } else if (U.arrayIndexOf([ "color" ], key)) {
                                this.element.backgroundColor = this.arg[key];
                            }
                        }
                        if (typeof this.callback === "function") {
                            return this.callback();
                        }
                        return false;
                    };
                    E.addEvent(this.element, "click", stopFn.bind(this));
                }
                this.intervalObj = {
                    "default": {
                        posDimMargin: function(a, q, n) {
                            return q / n;
                        },
                        color: "(notq/n)",
                        opacity: ""
                    },
                    parabolic: {
                        posDimMargin: function(a, q, n) {
                            return Math.pow(q, 2) * a.timer / n;
                        },
                        color: "r",
                        opacity: "r"
                    },
                    bounce: {
                        dimension: "r"
                    }
                };
                this.interval = this.intervalObj[fn] || this.intervalObj["default"];
            }
            animate.prototype.animate = function(args, timer, n) {
                this.timer = timer || 750;
                this.args = args;
                n = n || 10;
                if (n >= this.timer) {
                    throw new Error("Intervals must be less than the value of the timer");
                }
                if (typeof this.args !== "object") {
                    this.args = JSON.stringify(args);
                    if (this.args && typeof this.args !== "object") {
                        throw new Error("Please provide valid arguments");
                    }
                }
                if (this.args["color"]) {
                    this.endColor = getColor(args["color"]);
                    this.currentColor = getColor(U.getStyle(this.element, "background-color"));
                }
                this.performAnimation(n);
            };
            animate.prototype.performAnimation = function(n) {
                if (i == n) {
                    i = 0;
                    if (typeof this.callback === "function") {
                        return this.callback();
                    } else {
                        return;
                    }
                }
                for (var key in this.args) {
                    if (U.arrayIndexOf([ "top", "right", "bottom", "left", "margin-top", "margin-right", "margin-bottom", "margin-left", "height", "width" ], key)) {
                        posDimMargin(this, this.element, key, getVal(this, key), n);
                    } else if (U.arrayIndexOf([ "opacity" ], key)) {
                        opacity(this.element, getVal(this, key), n);
                    } else if (U.arrayIndexOf([ "color" ], key)) {
                        color(this.element, this.endColor.r, this.endColor.g, this.endColor.b, this.currentColor, n);
                    } else {
                        throw new Error("Animation type is not defined");
                    }
                }
                i++;
                this.timeout = setTimeout(this.performAnimation.bind(this, n), this.timer / n);
            };
            animate.prototype.fade = function(disp, n, inline) {
                n = n || 10;
                var interval = disp > 0 ? disp / n * -1 : 1 / n;
                if (i == n) {
                    this.element.style.opacity = "1";
                    i = 0;
                    if (typeof this.callback === "function") {
                        return this.callback();
                    } else {
                        return;
                    }
                }
                if (i == 0 && disp == 0) {
                    this.element.style.display = inline ? "inline-block" : "block";
                }
                this.element.style.opacity = (parseFloat(this.element.style.opacity === "" ? disp : this.element.style.opacity, 10) + interval).toString();
                if (i == n - 1 && disp >= 1) {
                    this.element.style.display = "none";
                }
                i++;
                this.timeout = setTimeout(this.fade.bind(this, disp, n, inline), this.timer / n);
            };
            animate.prototype.fadeIn = function(timer, n, inline) {
                this.timer = timer || 750;
                this.element.style.opacity = "0";
                this.fade(0, n, inline);
            };
            animate.prototype.fadeOut = function(timer, n) {
                this.timer = timer || 750;
                this.fade(U.getStyle(this.element, "opacity"), n);
            };
            function posDimMargin(a, el, dim, q, n) {
                var interval = a.interval.posDimMargin(a, q, n);
                el.style[dim] = (unit(U.getStyle(el, dim)) + interval).toString() + "px";
                if (i == n - 1) {
                    el.style[dim] = (unit(a.style[dim]) + q).toString() + "px";
                }
            }
            function opacity(el, q, n) {
                var interval = q / n;
                el.style.opacity = (Math.round((parseFloat(U.getStyle(el, "opacity"), 10) + interval) * 100) / 100).toString();
            }
            function getVal(a, key) {
                var dim = parseFloat(unit(a.style[key]), 10) || 0;
                if (a.args[key]["plus"]) {
                    return parseFloat(a.args[key]["plus"], 10);
                } else if (a.args[key]["val"]) {
                    var dist = parseFloat(a.args[key]["val"], 10) - dim;
                    return dist;
                } else {
                    throw new Error("No arguments specified along with animation type");
                }
            }
            function color(el, r, g, b, c, n) {
                var iR = Math.ceil((r - c.r) / n), iG = Math.ceil((g - c.g) / n), iB = Math.ceil((b - c.b) / n), C = getColor(U.getStyle(el, "background-color"));
                if (el.style.backgroundColor.trim() === "") {
                    el.style.backgroundColor = "rgb(" + C.r.toString() + "," + C.g.toString() + "," + C.b.toString() + ")";
                }
                el.style.backgroundColor = "rgb(" + (C.r + iR).toString() + "," + (C.g + iG).toString() + "," + (C.b + iB).toString() + ")";
            }
            function getColor(a) {
                var r, g, b;
                if (a.match(/^rgb/)) {
                    a = a.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
                    r = parseInt(a[1], 10);
                    g = parseInt(a[2], 10);
                    b = parseInt(a[3], 10);
                } else {
                    a = +("0x" + a.slice(1).replace(a.length < 5 && /./g, "$&$&"));
                    r = a >> 16;
                    b = a >> 8 & 255;
                    g = a & 255;
                }
                return {
                    r: r,
                    g: g,
                    b: b
                };
            }
            function unit(a) {
                return parseFloat(a.replace(/%|px/g, ""), 10);
            }
            return animate;
        }(document);
        module.exports = Animate;
    }, {
        "./eventManager": 3,
        "./util": 4
    } ],
    2: [ function(require, module, exports) {
        var animate = function() {
            var animate = require("../animate");
            return animate;
        }();
    }, {
        "../animate": 1
    } ],
    3: [ function(require, module, exports) {
        var EventManager = function(doc) {
            "use strict";
            var eventManager = {
                addEvent: addEvent,
                removeEvent: removeEvent,
                addEvents: addEvents,
                removeEvents: removeEvents,
                removeAllEvents: removeAllEvents
            };
            function addEvent(element, type, fn) {
                if (!element) {
                    throw new Error("Event Manager: No such element passed into add event");
                }
                if (element.addEventListener) {
                    element.addEventListener(type, fn, false);
                    return true;
                } else if (element.attachEvent) {
                    var r = element.attachEvent(type, fn);
                    return r;
                } else {
                    return false;
                }
            }
            function removeEvent(element, type, fn) {
                if (!element) {
                    throw new Error("Event Manager: No such element passed into remove event");
                }
                if (element.removeEventListener) {
                    element.removeEventListener(type, fn, false);
                } else {
                    element.detachEvent(type, fn);
                }
            }
            function addEvents(elements, type, fn) {
                for (var i = elements.length - 1; i >= 0; --i) {
                    addEvent(elements[i], type, fn);
                }
            }
            function removeEvents(elements) {
                for (var i = elements.length - 1; i >= 0; --i) {
                    removeAllEvents(elements[i]);
                }
            }
            function removeAllEvents(el) {
                var elP = el.cloneNode(true);
                el.parentNode.replaceChild(elP, el);
            }
            return eventManager;
        }(document);
        module.exports = EventManager;
    }, {} ],
    4: [ function(require, module, exports) {
        var Util = function(doc) {
            "use strict";
            var util = {
                rng: rng,
                equalObjects: equalObjects,
                debounce: debounce,
                throttle: throttle,
                arrayIndexOf: arrayIndexOf,
                getStyle: getStyle,
                jsonStringify: {
                    parse: parse,
                    stringify: stringify
                },
                unit: unit
            };
            function rng() {
                return Math.floor(Math.random(1) * 1e8 + 1).toString();
            }
            function equalObjects(x, y) {
                if (x === null || x === undefined || y === null || y === undefined) {
                    return x === y;
                }
                if (x === y || x.valueOf() === y.valueOf()) {
                    return true;
                }
                if (!(x instanceof Object)) {
                    return false;
                }
                if (!(y instanceof Object)) {
                    return false;
                }
                var p = Object.keys(x);
                return Object.keys(y).every(function(i) {
                    return p.indexOf(i) !== -1;
                }) ? p.every(function(i) {
                    return equalObjects(x[i], y[i]);
                }) : false;
            }
            function debounce(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this, args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            }
            function throttle(func, wait, options) {
                var context, args, result, timeout = null, previous = 0;
                options || (options = {});
                var later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function() {
                    var now = new Date();
                    if (!previous && options.leading === false) previous = now;
                    var remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout && options.trailing !== false) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            }
            function parse(string) {
                return eval("(" + string + ")");
            }
            function stringify(obj) {
                var t = typeof obj;
                if (t != "object" || obj === null) {
                    if (t == "string") {
                        obj = '"' + obj + '"';
                    }
                    return String(obj);
                } else {
                    var n, v, json = [], arr = obj && obj.constructor == Array;
                    for (n in obj) {
                        v = obj[n];
                        t = typeof v;
                        if (t == "function") {
                            continue;
                        }
                        if (t == "string") {
                            v = '"' + v + '"';
                        } else if (t == "object" && v !== null) {
                            v = this.stringify(v);
                        }
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
                }
            }
            function arrayIndexOf(obj, str) {
                for (var i = obj.length - 1; i >= 0; --i) {
                    if (obj[i] === str) {
                        return true;
                    }
                }
                return false;
            }
            function getStyle(el, cssprop) {
                if (el.currentStyle) {
                    return el.currentStyle[cssprop];
                } else if (document.defaultView && document.defaultView.getComputedStyle) {
                    return document.defaultView.getComputedStyle(el, "")[cssprop];
                } else {
                    return el.style[cssprop];
                }
            }
            function unit(v) {
                return parseFloat(v.replace(/px|%/g, ""), 10);
            }
            return util;
        }(document);
        module.exports = Util;
    }, {} ]
}, {}, [ 2 ]);