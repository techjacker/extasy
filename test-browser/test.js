(function (global) {

	/*--------------------------------------
	setup
	---------------------------------------*/

	var extasy = global.extasy;
	var failed = false;

	/*--------------------------------------
	fixtures
	---------------------------------------*/
	function Parent() {};
	Parent.prototype.foo = function(x, y) {
	    return x + y;
	};

	function Child() {};
	// must extend before overwriting prototype methods!
	extasy(Child, Parent);
	Child.prototype.foo = function(x, y) {
	    return 2 + this.super_.foo(x, y);
	};

	/*--------------------------------------
	tests
	---------------------------------------*/
	var ChildInst = new Child();
	var res = ChildInst.foo(1,3);

	if (res !== 6) {
		console.error('actual: ' + res, 'expected: 5');
		failed = true;
	};

	failed || console.log('ok');

}(this));