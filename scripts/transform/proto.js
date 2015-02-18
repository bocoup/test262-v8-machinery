/**
 * @file Transform `__proto__` property access to the equivalent expression
 * using `Object.getPrototypeOf`.
 *
 *     var proto1 = [].__proto__;
 *     var proto2 = []['__proto__'];
 *
 * becomes:
 *
 *     var proto1 = Object.getPrototypeOf([]);
 *     var proto2 = Object.getPrototypeOf([]);
 *
 * Motivation: the `__proto__` property is an AnnexB extension, so tests should
 * not rely on its behavior unless it is the explicit subject of the tests. The
 * V8 test suite uses the property extensively, making an automated
 * transformation worthwhile.
 */
'use strict';
var assert = require('assert');
var recast = require('recast');

module.exports = function(ast) {
	recast.visit(ast, {
		visitMemberExpression: function(path) {
			var prop = path.value.property;
			var obj;

			if (!(prop.type === 'Identifier' && prop.name === '__proto__') &&
				!(prop.type === 'Literal' && prop.value === '__proto__')) {
				this.traverse(path);
				return;
			}
			return recast.types.builders.callExpression(
				recast.types.builders.memberExpression(
					recast.types.builders.identifier('Object'),
					recast.types.builders.identifier('getPrototypeOf'),
					false
				),
				[path.value.object]
			);
		}
	});

	return ast;
};
