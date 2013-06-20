var _                   = require('underscore'),
	test                = require('tap').test,
	inheritsCheckProto  = require('tap-test-helpers').Oop.inheritsCheckProto,
	extendStatic        = require('./../lib/extend-static.js'),
	extendCtor 			= require('./../lib/extend-ctor.js');
	fixt            	= require('./test-fixtures.js'),
	fixtures            = fixt.staticTests(extendStatic, extendCtor);


// static tests
var AStatic = fixtures.A;
var BStatic = fixtures.B;
inheritsCheckProto(BStatic, AStatic);

/*--------------------------------------
check values returned are correct
---------------------------------------*/
fixt.checkValues(fixtures.C);