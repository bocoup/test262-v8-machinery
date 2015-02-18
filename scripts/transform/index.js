'use strict';

var recast = require('recast');

var transforms = {
  assertions: require('./assertions'),
  comments: require('./comments'),
  proto: require('./proto')
}

module.exports = function(code) {
	var ast = recast.parse(code);
	var result = transforms.assertions(ast);
	result.ast = transforms.proto(ast);
	transforms.comments(result.ast, { dependencies: result.dependencies });

	return recast.print(ast).code;
};
