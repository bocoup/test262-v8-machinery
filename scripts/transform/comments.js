'use strict';

var licenseYearPattern = /\bcopyright (\d{4})\b/i;

function makeFrontMatter(ast, dependencies) {
	var value = [
		'es6id: ',
		'description: >'
	];
	var includes;

	if (dependencies.length) {
		includes = dependencies.map(function(file) {
			return file + '.js';
		}).join(', ');
		value.push('includes: [' + includes + ']');
	}
	value = '---\n' + value.join('\n') + '\n---';

	return {
		type: 'Block',
		value: value,
		leading: true,
		trailing: false
	};
}

function makeLicense(ast) {
	var year = new Date().getFullYear();

	if (ast.program.comments) {
		var commentText = ast.program.comments.map(function(node) {
			return node.value;
		}).join(' ');

		var match = licenseYearPattern.exec(commentText);

		if (!match) {
			throw new Error('Could not infer license year.');
		}

		year = match[0];
	}


	return [
		{
			type: 'Line',
			value: ' Copyright (C) ' + year + ' the V8 project authors. ' +
				'All rights reserved.',
			leading: true,
			trailing: false
		},
		{
			type: 'Line',
			value: ' This code is governed by the BSD license found in the ' +
				'LICENSE file.',
			leading: true,
			trailing: false
		}
	];
}

module.exports = function(ast, options) {
	var comments = ast.program.comments || [];
	var license = makeLicense(ast);
	var frontMatter = makeFrontMatter(ast, options.dependencies);

	comments.push.apply(comments, license);
	comments.push(frontMatter);
};
