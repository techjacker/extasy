var	test = require('tap').test;

var ctorTests = function (extendFn) {

	function A() {};
	A.prototype.foo = function(x, y) {
		return x + y;
	};

	function B() {};
	extendFn(B, A); // must extend before overwriting prototype methods!
	B.prototype.foo = function(x, y) {
		// return 2 + this.constructor.super_.foo(x, y);
		return 2 + this.super_.foo(x, y);
	};

	function C() {};
	extendFn(C, B); // must extend before overwriting prototype methods!
	C.prototype.foo = function(x, y) {
		return 4 + this.super_.foo(x, y);
		// return 4 + this.constructor.super_.foo(x, y);
	};
	return {
		A: A,
		B: B,
		C: C
	}
};


var staticTests = function (extendFn1, extendFn2) {

	function A() {};
	extendFn1(A, {
		foo: function(x, y) {
			return x + y;
		}
	});

	function B() {};
	extendFn2(B, A);
	B.prototype.foo = function(x, y) {
		// return 2 + this.constructor.super_.foo(x, y);
		return 2 + this.super_.foo(x, y);
	};

	function C() {};
	extendFn2(C, B); // must extend before overwriting prototype methods!
	C.prototype.foo = function(x, y) {
		return 4 + this.super_.foo(x, y);
		// return 4 + this.constructor.super_.foo(x, y);
	};

	return {
		A: A,
		B: B,
		C: C
	}
};

var checkValues = function (C) {

	test('chaining super_ calls', function(t) {
		t.equal((new C()).foo(1,2), 9, 'C.foo() shd return 9 (C.foo() + B.foo() + A.foo())');
		t.end();
	});

	test('overloading parent methods', function(t) {

		var d = new C();
		d.foo = function(x, y) {

			// these 3 work:
			// return 8 + this.parent_.foo(x, y); // works if use HP extends
			return 8 + this.constructor.prototype.foo(x, y);
			// return 8 + C.prototype.foo(x, y);

			// does not work: returns 13
			// skips C.prototype.foo and goes straight to B.prototype.foo()
			// return 8 + this.super_.foo(x, y);
		};

		t.equal(d.foo(1,2), 17, 'D.foo() shd return 17 (D.foo() + C.foo() + B.foo() + A.foo())');
		t.end();
	});
};


var CopyInstanceProps = function (extendFn) {

	function A() {};
	A.foo = function() {
		return 'foo';
	};

	function B() {};
	extendFn(B, A, {
		randomFn: function () {
			return 'randomFn';
		}
	}); // must extend before overwriting prototype methods!
	B.prototype.foo = function(x, y) {
		return 'proto foo';
	};

	var BInstance = new B();

	test('parent class instance methods shd be copied to the child', function(t) {
		t.equal(B.foo(), 'foo', 'B.foo() shd return parent instance method value');
		t.equal(BInstance.constructor.foo(), 'foo', 'BInstance.constructor.foo() shd return parent instance method value');
		t.equal(B.prototype.foo(), 'proto foo', 'B.prototype.foo() shd return child class prototype value');
		t.ok(BInstance.super_ === A.prototype, 'B._super === A.prototype');
		t.end();
	});

	test('object literal static props shd be copied to the child', function(t) {
		t.equal(B.randomFn(), 'randomFn', 'B.randomFn() shd return parent instance method value');
		t.equal(BInstance.constructor.randomFn(), 'randomFn', 'BInstance.constructor.randomFn() shd return parent instance method value');
		t.end();
	});

};

module.exports = {
	ctorTests: ctorTests,
	staticTests: staticTests,
	CopyInstanceProps: CopyInstanceProps,
	checkValues: checkValues
};