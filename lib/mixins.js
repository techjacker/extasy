var returnCorrectObj = function (item) {
	var objLiteral = (item.constructor === Object.prototype.constructor);
	return objLiteral ? item : item.prototype;
};

var Mixin = {
	instancePropsMixin: function(child, parent) {
		var __hasProp = {}.hasOwnProperty;
		// copy instance properties from parent to child
		for (var key in parent) {
			if (__hasProp.call(parent, key)) {
				child[key] = parent[key];
			}
		}
		return child;
	},

	// optional copy instance properties from parentCtor to childCtor, eg
	// parentCtor.name === childCtor.name // only parentCtor.prototype.* copied by default
	staticMethods: function (childCtor, parentCtor, staticProps) {

		var validObjLiteral = (staticProps && staticProps.constructor === Object.prototype.constructor);

		Mixin.instancePropsMixin(childCtor, parentCtor);

		validObjLiteral && Mixin.instancePropsMixin(childCtor, staticProps);

		return childCtor;
	},
	protoMixin: function(arrayParents) {

		var single = {}, objClass;

		for (var i = arrayParents.length - 1; i >= 0; i--) {
			objClass = returnCorrectObj(arrayParents[i]);
			for (var key in objClass) {
				single[key] = objClass[key];
			}
		};
		// console.log('single', single);
		// underscore way..
		// var parentProtos = _.(arrayParents).map(function(parent) {
		// 	return parent.prototype;
		// });
		// _.extend(single, Array.prototype.slice.call(parentProtos));

		// copy instance properties from parent to child
		return single;
	}
};

module.exports = Mixin;