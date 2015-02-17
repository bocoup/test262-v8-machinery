'use strict';

var recast = require('recast');

var transforms = {
  assertions: require('./assertions'),
  comments: require('./comments')
}

module.exports = function(code) {
	var ast = recast.parse(code);
	var result = transforms.assertions(ast);
	transforms.comments(result.ast, { dependencies: result.dependencies });

	return recast.print(ast).code;
};
