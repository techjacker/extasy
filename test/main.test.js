var _                  = require('underscore'),
    test               = require('tap').test,
    inheritsCheckProto = require('tap-test-helpers').Oop.inheritsCheckProto,
    extend             = require('./../lib/main.js'),
    fixtures           = require('./test-fixtures.js'),
    ctorFixtures       = fixtures.ctorTests(extend),
    staticFixtures     = fixtures.staticTests(extend, extend);

/*--------------------------------------
check proto chain
---------------------------------------*/
// ctor tests
var ACtor = ctorFixtures.A;
var BCtor = ctorFixtures.B;
var CCtor = ctorFixtures.C;
inheritsCheckProto(CCtor, BCtor);
inheritsCheckProto(BCtor, ACtor);

// static tests
var AStatic = staticFixtures.A;
var BStatic = staticFixtures.B;
inheritsCheckProto(BStatic, AStatic);

/*--------------------------------------
check values returned are correct
---------------------------------------*/
fixtures.checkValues(CCtor);
fixtures.checkValues(staticFixtures.C);

/*--------------------------------------
check copying instance properties
---------------------------------------*/
fixtures.CopyInstanceProps(extend);

/*--------------------------------------
check multi parents
---------------------------------------*/
var returnVal = function(val) {
		return function () { return val; };
	},
	bam = returnVal('bam'),
	baz = returnVal('baz'),
	// static Classes
	ParentStaticA = {"bam": bam},
	ParentStaticB = {"baz": baz},
	ParentCtorA = function () {},
	ParentCtorB = function () {};

ParentCtorA.prototype.bam = bam;
ParentCtorB.prototype.baz = baz;


var overloadChild = function (parentsArr) {

	var AClass = function () {},
		overload = function (meth) {
			return function () {
				console.log('this.super_', this.super_);
				return this.super_[meth]();
				// return this.constructor.super_[meth]();
			};
		};

	extend(AClass, parentsArr);

	AClass.baz = overload('baz');
	AClass.bam = overload('bam');

	return AClass;
};




/*--------------------------------------
tests
---------------------------------------*/
var multiParentInheritanceTests = function (Class) {
	var ClassInstance = new Class();
	// console.log('ClassInstance.baz()', ClassInstance.baz());

	test('test unheriting from multiple parents', function(t) {
		t.equal(ClassInstance.bam(), 'bam', 'ClassInstance shd be able to access prototype properties of 1st parent');
		t.equal(ClassInstance.baz(), 'baz', 'ClassInstance shd be able to access prototype properties of 2nd parent');
		t.end();
	});
};

var AStatic = overloadChild([ParentStaticA, ParentStaticB]);
multiParentInheritanceTests(AStatic);

var ACtor = overloadChild([ParentCtorA, ParentCtorB]);
multiParentInheritanceTests(ACtor);