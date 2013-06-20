var _     = require('underscore');
var Mixin = require('./mixins.js');

// adds .parent_ property (this.parent_ === this.constructor.prototype)
// -> useful for when want to reference class that gave birth to instance
// -> useless for extend-static extends
// require('./parent-property.js');

/**
 * Extend function inspired by coffeescript, typescript and google closure inheritance patterns
 *
 * @module Extasy
 */
var Extasy = function (child, parent, staticProps) {

	var multiParents = _.isArray(parent),
		staticExtend = (multiParents || (parent.constructor === Object.prototype.constructor)),
		extendFn 	 = staticExtend ? './extend-static.js' : './extend-ctor.js';

	// allow multiple parents
	multiParents && (parent = Mixin.protoMixin(parent));

	// optional copy instance properties from parentCtor to child, eg
	// parentCtor.name === child.name // only parentCtor.prototype.* copied by default
	Mixin.staticMethods(child, parent, staticProps);

	return require(extendFn)(child, parent, staticProps);
};

module.exports = Extasy;