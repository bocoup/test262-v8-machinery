#!/usr/bin/env node
var recast = require('recast');
var messages = require('./transform/messages');
var exec = require('child_process').exec;
var fs = require('fs');
var glob = require('glob');
var usage = [
	'Usage: assertion-messages.js "globbing expression"',
	'To generate assertion messages for a set of test files, provide a valid glob expression.',
	'File search begins at `../test262/test/`'
].join('\n');

var gexpr = process.argv[2];

if (!gexpr) {
	console.log(usage);
	return;
}

glob('../test262/test/' + gexpr, function(err, list) {

	list.forEach(function(file) {
		var source = fs.readFileSync(file, 'utf8');

		try {
			var ast = recast.parse(source);
			var result = messages(ast);
			fs.writeFileSync(file, recast.print(ast).code, 'utf8');
		} catch (e) {
			console.log("failed: ", file);
		}
	});
});
