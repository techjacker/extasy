var _                  = require('underscore'),
	test               = require('tap').test,
	inheritsCheckProto = require('tap-test-helpers').Oop.inheritsCheckProto,
	extend             = require('./../lib/extend-ctor.js'),
	fixt           	   = require('./test-fixtures.js'),
	fixtures           = fixt.ctorTests(extend);

var A = fixtures.A;
var B = fixtures.B;
var C = fixtures.C;

// check proto chain
inheritsCheckProto(C, B);
inheritsCheckProto(B, A);

// check values returned are correct
fixt.checkValues(C);