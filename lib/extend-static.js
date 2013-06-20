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