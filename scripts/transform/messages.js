'use strict';

var assert = require('assert');
var recast = require('recast');

function AssertionMessage(actual, expected) {
	this.actual = recast.print(actual).code;
	this.expected = recast.print(expected).code;
	this.prefix = '';
	this.infix = 'is';
	this.suffix = '';

	if (actual.type === 'CallExpression') {
		this.infix = 'returns';
	}

	if (actual.type === 'MemberExpression' || actual.type === 'Identifier') {
		this.prefix = 'The value of';
	}

	if (actual.type === 'BinaryExpression' || actual.type === 'UpdateExpression') {
		this.prefix = 'The result of';
	}
}

AssertionMessage.wrap = function(target, prefix, suffix) {
	if (!suffix) {
		suffix = prefix;
	}

	return prefix + target + suffix;
};

AssertionMessage.code = function(target) {
	return AssertionMessage.wrap(target, "`");
};

AssertionMessage.prototype.toString = function() {
	return [
		this.prefix,
		AssertionMessage.code(this.actual),
		this.infix,
		AssertionMessage.code(this.expected),
		this.suffix
	].join(' ').trim();
};

var messages = {
	assert: function(path) {

		if (path.parentPath.value.type !== 'CallExpression') {
			return;
		}

		// Special case: assert(false)
		if (path.parentPath.value.type === 'CallExpression' &&
				(path.parentPath.value.callee.name === 'assert' &&
					path.parentPath.value.arguments.length === 1 &&
					path.parentPath.value.arguments[0].type === 'Literal' &&
					path.parentPath.value.arguments[0].value === false)) {


			var args = path.parentPath.value.arguments;

			// This will intentionally create messages that cause errors
			// to hopefully prevent them from being missed during review.
			args[0] = '!REVIEW!';
			path.value.name = '$ERROR';

			return;
		}

		var args = path.parentPath.value.arguments;
		var message = new AssertionMessage(args[0], recast.types.builders.literal(true));

		if (args[1]) {
			return;
		}

		args[1] = recast.types.builders.literal(message.toString());
	},
	sameValue: function(path) {

		var args = path.parentPath.parentPath.value.arguments;
		var message;

		if (args[2]) {
			return;
		}

		message = new AssertionMessage(args[0], args[1]);

		args[2] = recast.types.builders.literal(message.toString());
	},
};

module.exports = function(ast) {
	var visitor = recast.visit(ast, {
		visitIdentifier: function(path) {
			var node = path.value;
			var result;

			if (messages.hasOwnProperty(node.name)) {
				messages[node.name](path);
			}
			this.traverse(path);
		}
	});

	return {
		ast: ast
	};
}
