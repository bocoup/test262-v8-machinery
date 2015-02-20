'use strict';

var es6 = require('es6-shim');
var recast = require('recast');

var transforms = {
  assertions: require('./assertions'),
  comments: require('./comments'),
  proto: require('./proto')
}

module.exports = function(code, options) {

  options = options || {};

  var defaults = {
    assertions: true,
    proto: true,
    comments: true
  };

  var operations = Object.assign({}, defaults, options);
  var ast = recast.parse(code);
  var result;

  if (operations.assertions) {
    result = transforms.assertions(ast);
  }

  if (operations.proto) {
    result.ast = transforms.proto(result.ast);
  }

  if (operations.comments) {
    result.ast = transforms.comments(result.ast, { dependencies: result.dependencies });
  }

  return recast.print(ast).code;
};
