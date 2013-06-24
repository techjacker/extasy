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