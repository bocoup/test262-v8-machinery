'use strict';

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

module.exports = function(ast, options) {
	ast.program.comments.push(makeFrontMatter(ast, options.dependencies));
};
