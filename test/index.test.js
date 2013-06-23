var _                  = require('underscore'),
    test               = require('tap').test,
    extend             = require('./../index.js');

/*--------------------------------------
README tests
---------------------------------------*/
test('Constructor class parents', function(t) {
	var assert = t.ok.bind(t);

	function Child() {
		this.hello = 'world';
	};
	function Parent() {};
	extend(Child, Parent);
	var ChildInst = new Child();
	assert(ChildInst.super_ === Parent.prototype);
	assert(ChildInst.hello === 'world');
	t.end();
});

test('Static class parents', function(t) {
	var assert = t.ok.bind(t);

	function Child() {};
	var Parent = {};
	extend(Child, Parent);
	assert(Child.super_ === Parent);
	var ChildInst = new Child();
	assert(ChildInst.constructor.super_ === Parent);

	t.end();
});


test('Multiple Parents', function(t) {
	var assert = t.ok.bind(t);

	function Child() {};
	function Parent() {};
	Parent.prototype.kinky = function () { return 'yes, ' + this.menage; };
	function Parent2() {};
	var Parent3 = {menage: 'a trois'};

	// inherit
	extend(Child, [Parent, Parent2, Parent3]);
	var ChildInst = new Child();

	assert(Child.prototype.kinky === Parent.prototype.kinky);
	assert(ChildInst.constructor.prototype.kinky === Parent.prototype.kinky);
	assert(Child.kinky() === 'yes, a trois');
	assert(ChildInst.kinky() === 'yes, a trois');

	t.end();
});



/*--------------------------------------
Copying Instance Props
---------------------------------------*/
test('Copies Constructor Parent\'s Instance Methods & Properties', function(t) {
	var assert = t.ok.bind(t);

	function Parent() {};
	Parent.prototype.random = 'randomness';
	Parent.random = 'random';
	Parent.bar = 'bar';
	function Child() {};
	extend(Child, Parent);

	// differences child class vs instance
	var ChildInst = new Child();
	assert(Child.bar === Parent.bar);
	assert(Child.super_ === undefined);
	assert(ChildInst.super_ !== undefined);
	assert(Child.random === Parent.random);
	assert(Child.random === 'random');
	assert(ChildInst.constructor.random === 'random');
	assert(ChildInst.super_.random === 'randomness');

	t.end();
});



/*--------------------------------------
Overloading
---------------------------------------*/
test('Overloading Constructor Class Parent', function(t) {
	var assert = t.ok.bind(t);

	function Child() {};
	function Parent() {};
	Parent.prototype.foo = function () { return 'father'; };
	extend(Child, Parent);

	// extend the protoype after extending or else will fail...
	Child.prototype.foo = function () {
		return 'you are my ' + this.super_.foo();
	}

	// initialise
	var ChildInst = new Child();
	assert(ChildInst.foo() === 'you are my father');

	// overload
	ChildInst.foo = function () {
		return 'you WERE my ' + this.super_.foo();
	}
	assert(ChildInst.foo() === 'you WERE my father');

	t.end();
});



test('Overloading Static Class Parent', function(t) {
	var assert = t.ok.bind(t);

	function Child() {};
	var Parent = {foo: function () { return 'father'; }};
	extend(Child, Parent);

	// can't overload thru prototype - need to do thru instance
	assert(Child.super_.foo === Parent.foo);
	assert(Child.prototype.foo === Parent.foo);
	Child.foo = function () {
		return 'you are my ' + this.super_.foo();
	}

	// overloading instance
	var ChildInst = new Child();
	assert(Child.foo() === 'you are my father');
	assert(ChildInst.constructor.foo() === 'you are my father');

	t.end();
});





test('Overloading Multiple Parents', function(t) {
	var assert = t.ok.bind(t);

	function Child() {};
	function Parent() {};
	Parent.prototype.kinky = function () { return 'yes, ' + this.menage; };
	function Parent2() {};
	var Parent3 = {menage: 'a trois'};

	// inherit
	extend(Child, [Parent, Parent2, Parent3]);
	var ChildInst = new Child();

	// can't overload thru prototype - need to do thru instance
	assert(Child.super_.kinky === Parent.prototype.kinky);
	assert(Child.prototype.kinky === Parent.prototype.kinky);

	// class overloading
	Child.kinky = function () {
		return 'Q: Is my parent kinky? A: ' + this.super_.kinky();
	};
	assert(Child.kinky() === 'Q: Is my parent kinky? A: yes, a trois');
	assert(ChildInst.kinky() !== 'Q: Is my parent kinky? A: yes, a trois');

	// instance overloading
	var ChildInstOverload = new Child();
	t.equal(ChildInstOverload.kinky(),'yes, a trois');
	ChildInstOverload.kinky = function () {
		return 'Q: Is my class\'s parent kinky? A: ' + this.constructor.super_.kinky();
	};
	t.equal(ChildInstOverload.kinky(),'Q: Is my class\'s parent kinky? A: yes, a trois');
	t.end();
});