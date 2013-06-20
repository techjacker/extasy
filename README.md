# extasy

[![Build Status](https://secure.travis-ci.org/techjacker/extasy.png)](http://travis-ci.org/techjacker/extasy)

Extend function inspired by coffeescript, typescript and google closure inheritance patterns.

### Install
```Shell
npm install extasy
```

### Docs
[Yuidocs documentation here](docs/index.html)
- link only works when checkout repo and preview README locally

### Full Example

```JavaScript
var extend = require('./lib/main.js');

function Parent() {};
Parent.prototype.foo = function(x, y) {
	return x + y;
};

function Child() {};
// must extend before overwriting prototype methods!
extend(Child, Parent);
Child.prototype.foo = function(x, y) {
	return 2 + this.super_.foo(x, y);
};

/*--------------------------------------
no tests throw an error
---------------------------------------*/
var ChildInst = new Child();

var assert = require('assert');
assert(ChildInst.constructor === Child);
assert(ChildInst.super_ === Parent.prototype);
assert(Object.getPrototypeOf(ChildInst) === Child.prototype);
assert(Object.getPrototypeOf(Object.getPrototypeOf(ChildInst)) === Parent.prototype);
assert(ChildInst instanceof Child);
assert(ChildInst instanceof Parent);

console.log('ok');
```