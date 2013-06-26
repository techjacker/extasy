(function(e){if("function"==typeof bootstrap)bootstrap("extasy",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeExtasy=e}else"undefined"!=typeof window?window.extasy=e():global.extasy=e()})(function(){var define,ses,bootstrap,module,exports;
return (function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var Mixin = require('./mixins.js');
var extCtor = require('./extend-ctor.js');
var extStatic = require('./extend-static.js');

// adds .parent_ property (this.parent_ === this.constructor.prototype)
// -> useful for when want to reference class that gave birth to instance
// -> useless for extend-static extends
// require('./parent-property.js');


/**
 * @class Extasy
 * @constructor
 * Extend function inspired by coffeescript, typescript and google closure inheritance patterns.
 *
 * @example
 * ## Features
 *
 * ### Accepts Constructor or Static Class Parents
 * Parent can be either a constructor or static class (ie constructor functions or object literals).

 * #### Constructor Parents
 * Parent's prototype methods are placed on child's prototype (static methods if parent is object literal).
 *
 * 	function Child() {};
 * 	function Parent() {};
 * 	extend(Child, Parent);
 * 	var ChildInst = new Child();
 * 	assert(ChildInst.super_ === Parent.prototype);
 * 	assert(ChildInst.hello === 'world');
 *
 * #### Static Parents
 * 	function Child() {};
 * 	var Parent = {};
 * 	extend(Child, Parent);
 * 	assert(Child.super_ === Parent);
 * 	var ChildInst = new Child();
 * 	assert(ChildInst.constructor.super_ === Parent);
 *
 * #### Multiple Parents
 *
 * 	function Child() {};
 * 	function Parent() {};
 * 	Parent.prototype.kinky = function () { return 'yes, ' + this.menage; };
 * 	function Parent2() {};
 * 	var Parent3 = {menage: 'a trois'};

 * 	// inherit
 * 	extend(Child, [Parent, Parent2, Parent3]);
 * 	var ChildInst = new Child();

 * 	assert(Child.prototype.kinky === Parent.prototype.kinky);
 * 	assert(ChildInst.constructor.prototype.kinky === Parent.prototype.kinky);
 * 	assert(Child.kinky() === 'yes, a trois');
 * 	assert(ChildInst.kinky() === 'yes, a trois');
 *
 *
 *
 *
 * ### Copies Constuctor* Parent's Instance Methods & Properties
 * Parent's instance methods are set as child instance methods if parent is a constructor class.
 * Does not do this for static classes because their 'instance' methods are put on the prototype
 *
 * 	function Child() {};
 * 	function Parent() {};
 * 	Parent.prototype.random = 'randomness';
 * 	Parent.random = 'random';
 * 	Parent.bar = 'bar';
 * 	extend(Child, Parent);
 *
 * 	// differences child class vs instance
 * 	var ChildInst = new Child();
 * 	assert(Child.bar === Parent.bar);
 * 	assert(Child.super_ === undefined);
 * 	assert(ChildInst.super_ !== undefined);
 * 	assert(Child.random === Parent.random);
 * 	assert(Child.random === 'random');
 * 	assert(ChildInst.constructor.random === 'random');
 * 	assert(ChildInst.super_.random === 'randomness');
 *
 *
 *
 *
 * ### Overloading
 *
 * ####  Overloading Constructor Class Parent
 *	function Child() {};
 *	function Parent() {};
 *	Parent.prototype.foo = function () { return 'father'; };
 *	extend(Child, Parent);

 *	// extend the protoype after extending or else will fail...
 *	Child.prototype.foo = function () {
 *		return 'you are my ' + this.super_.foo();
 *	}

 *	// initialise
 *	var ChildInst = new Child();
 *	assert(ChildInst.foo() === 'you are my father');

 *	// overload
 *	ChildInst.foo = function () {
 *		return 'you WERE my ' + this.super_.foo();
 *	}
 *	assert(ChildInst.foo() === 'you WERE my father');
 *
 *
 * #### Overloading Static Class Parent
 *	function Child() {};
 *	var Parent = {foo: function () { return 'father'; }};
 *	extend(Child, Parent);

 *	// can't overload thru prototype - need to do thru instance
 *	assert(Child.super_.foo === Parent.foo);
 *	assert(Child.prototype.foo === Parent.foo);
 *	Child.foo = function () {
 *		return 'you are my ' + this.super_.foo();
 *	}

 *	// overloading instance
 *	var ChildInst = new Child();
 *	assert(Child.foo() === 'you are my father');
 *	assert(ChildInst.constructor.foo() === 'you are my father');
 *
 *
 * #### Overloading Multiple Parents
 *
 *	function Child() {};
 *	function Parent() {};
 *	Parent.prototype.kinky = function () { return 'yes, ' + this.menage; };
 *	function Parent2() {};
 *	var Parent3 = {menage: 'a trois'};

 *	// inherit
 *	extend(Child, [Parent, Parent2, Parent3]);
 *	var ChildInst = new Child();

 *	// can't overload thru prototype - need to do thru instance
 *	assert(Child.super_.kinky === Parent.prototype.kinky);
 *	assert(Child.prototype.kinky === Parent.prototype.kinky);

 *	// class overloading
 *	Child.kinky = function () {
 *		return 'Q: Is my parent kinky? A: ' + this.super_.kinky();
 *	};
 *	assert(Child.kinky() === 'Q: Is my parent kinky? A: yes, a trois');
 *	assert(ChildInst.kinky() !== 'Q: Is my parent kinky? A: yes, a trois');

 *	// instance overloading
 *	var ChildInstOverload = new Child();
 *	t.equal(ChildInstOverload.kinky(),'yes, a trois');
 *	ChildInstOverload.kinky = function () {
 *		return 'Q: Is my class\'s parent kinky? A: ' + this.constructor.super_.kinky();
 *	};
 *	t.equal(ChildInstOverload.kinky(),'Q: Is my class\'s parent kinky? A: yes, a trois');
 *
 *
 *
 * @param {Constructor} child Constructor function for child class that you want to create
 *
 * @param {Class|Array} parent A single class or an array of classes that you want the child to inherit from. The paren(t's/ts') methods will be put on the child's prototype. If the parent is a dynamic class (ie uses a constructor function) then the parent's prototype methods will be put on the child's prototype. If the parent is a static class (ie an object literal) then it's static methods will be put on the child's prototype. If an array of classes is passed in then these will be flattened (ie a single parent class combining all the methods to be inherited will be created) before applying to the child's prototype.
 *
 * @param  {[Object]} staticProps Optional instance methods to give the class when instantiated (won't be put on proto). By default the paren(t's/ts') instance methods are applied to the child as instance methods
 *
 * @return {Class} The child class is returned
 */
var Extasy = function (child, parent, staticProps) {

	if (!(this instanceof Extasy)) {
		return new Extasy(child, parent, staticProps);
	}

	var multiParents = (parent instanceof Array),
		staticExtend = (multiParents || (parent.constructor === Object.prototype.constructor)),
		extendFn 	 = staticExtend ? 'extStatic' : 'extCtor';

	// allow multiple parents
	multiParents && (parent = this.protoMixin(parent));

	// optional copy instance properties from parentCtor to child, eg
	// parentCtor.name === child.name // only parentCtor.prototype.* copied by default
	this.staticMethods(child, parent, staticProps);

	return this[extendFn](child, parent, staticProps);
};

var multiParents = [Mixin, {
	extCtor:extCtor,
	extStatic:extStatic
}];
Extasy.prototype = Mixin.protoMixin(multiParents);
Extasy.prototype.constructor = Extasy;

module.exports = Extasy;
},{"./mixins.js":2,"./extend-static.js":3,"./extend-ctor.js":4}],3:[function(require,module,exports){
var extendStatic = function (childCtor, parentStaticClass) {

	childCtor.super_ = parentStaticClass;
	// console.log('childCtor.super_', childCtor.super_);

	childCtor.prototype = Object.create(parentStaticClass, {
		constructor: {
			value: childCtor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
	return childCtor;
};

module.exports = extendStatic;
},{}],2:[function(require,module,exports){
var returnCorrectObj = function (item) {
	var objLiteral = (item.constructor === Object.prototype.constructor);
	return objLiteral ? item : item.prototype;
};

var Mixin = {
	instancePropsMixin: function(child, parent) {
		var __hasProp = {}.hasOwnProperty;
		// copy instance properties from parent to child
		for (var key in parent) {
			if (__hasProp.call(parent, key)) {
				child[key] = parent[key];
			}
		}
		return child;
	},

	// optional copy instance properties from parentCtor to childCtor, eg
	// parentCtor.name === childCtor.name // only parentCtor.prototype.* copied by default
	staticMethods: function (childCtor, parentCtor, staticProps) {

		var validObjLiteral = (staticProps && staticProps.constructor === Object.prototype.constructor);

		Mixin.instancePropsMixin(childCtor, parentCtor);

		validObjLiteral && Mixin.instancePropsMixin(childCtor, staticProps);

		return childCtor;
	},
	protoMixin: function(arrayParents) {

		var single = {}, objClass;

		for (var i = arrayParents.length - 1; i >= 0; i--) {
			objClass = returnCorrectObj(arrayParents[i]);
			for (var key in objClass) {
				single[key] = objClass[key];
			}
		};
		// console.log('single', single);
		// underscore way..
		// var parentProtos = _.(arrayParents).map(function(parent) {
		// 	return parent.prototype;
		// });
		// _.extend(single, Array.prototype.slice.call(parentProtos));

		// copy instance properties from parent to child
		return single;
	}
};

module.exports = Mixin;
},{}],4:[function(require,module,exports){
var Mixin = require('./mixins.js');

var extendCtor = function (childCtor, parentCtor) {

	var tmp = function() {
		this.super_ = parentCtor.prototype; // typescript
		// this.super_ = this.constructor.prototype // works as well
		// console.log('this.super_', this.super_);
	};
	tmp.prototype = parentCtor.prototype;
	// childCtor.super_  = parentCtor.prototype; // means you have to reference using this.constructor.super_.

	// apply to childCtor
	childCtor.prototype = new tmp();
	childCtor.prototype.constructor = childCtor;

	return childCtor;
};

module.exports = extendCtor;
},{"./mixins.js":2}]},{},[1])(1)
});
;