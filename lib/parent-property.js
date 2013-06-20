// so don't have to run this.constructor.prototype
// in ChildInstance.foo() to access Child.prototype.foo()
Object.defineProperty(Object.prototype, "parent_", {
	get: function() {
		return this.constructor.prototype;
	},
	enumerable: true,
	configurable: true
});

module.exports = Extasy;