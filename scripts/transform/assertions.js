'use strict';

var assert = require('assert');
var recast = require('recast');

var assertions = {
	assertThrows: function(path) {
		var args = path.parentPath.value.arguments;

		assert.equal(args.length, 2, 'Unexected invocation of assertThrows');

		args.unshift(args.pop());
		path.value.name = 'assert.throws';
	},
	assertSame: function(path) {
		var args = path.parentPath.value.arguments;
		var expected = args[0];

		assert(args.length > 1 && args.length < 4, 'Unexpected invocation of assertSame');

		args[0] = args[1];
		args[1] = expected;
		path.value.name = 'assert.sameValue';
	},
	assertTrue: function(path) {
		path.value.name = 'assert';
	},
	assertFalse: function(path) {
		var args = path.parentPath.value.arguments;
		if (args.length > 1) {
			args[2] = args[1];
		}
		args[1] = recast.types.builders.literal(false);
		path.value.name = 'assert.sameValue';
	},
	assertNull: function(path) {
		var args = path.parentPath.value.arguments;
		if (args.length > 1) {
			args[2] = args[1];
		}

		args[1] = recast.types.builders.literal(null);
		path.value.name = 'assert.sameValue';
	},
	assertNotNull: function(path) {
		var args = path.parentPath.value.arguments;
		args[0] = recast.types.builders.binaryExpression(
			'!==', args[0], recast.types.builders.literal(null)
		);

		path.value.name = 'assert';
	},
	assertDoesNothThrough: function() {
		throw new Error('`assertDoesNotThrow` is not implemented');
	},
	assertUnreachable: function(path) {
		var args = path.parentPath.value.arguments;
		if (args.length) {
			args[1] = args[0];
		}
		args[0] = recast.types.builders.literal(false);
		path.value.name = 'assert';
	},
	assertArrayEquals: function(path) {
		var args = path.parentPath.value.arguments;
		var expected = args[0];
		var callee = recast.types.builders.identifier('compareArray');

		args[0] = recast.types.builders.callExpression(callee, [
			expected,
			args[1]
		]);


		if (args.length === 2) {
			args.length = 1;
		} else {
			args[1] = args.pop();
		}

		path.value.name = 'assert';

		return { dependencies: ['compareArray'] };
	}
};

module.exports = function(ast) {
	var dependencies = [];

	var visitor = recast.visit(ast, {
		visitIdentifier: function(path) {
			var node = path.value;
			var result;

			if (assertions.hasOwnProperty(node.name)) {
				if (path.parentPath.value.type !== 'CallExpression') {
					var callExpr = recast.types.builders.callExpression(path.value, [])
					var fnExpr = recast.types.builders.functionExpression(
						null,
						[],
						recast.types.builders.blockStatement([
							recast.types.builders.expressionStatement(
								callExpr
							)
						])
					);

					return fnExpr;
				}
				// We could special cases for different function invocations
				// patterns, but that would probably be an over-optimization in
				// this context. Throw an error to prompt manual intervention.

				result = assertions[node.name](path);

				if (result && result.dependencies) {
					result.dependencies.forEach(function(file) {
						if (dependencies.indexOf(file) > -1) {
							return;
						}
						dependencies.push(file);
					});
				}
			}
			this.traverse(path);
		}
	});

	return {
		ast: ast,
		dependencies: dependencies
	};
}
