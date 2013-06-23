// adds .parent_ property (this.parent_ === this.constructor.prototype)
// -> useful for when want to reference class that gave birth to instance
// -> useless for extend-static extends
// require('./parent-property.js');
var _     = require('underscore');
var Mixin = require('./mixins.js');
var extCtor = require('./extend-ctor.js');
var extStatic = require('./extend-static.js');

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

	var multiParents = _.isArray(parent),
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