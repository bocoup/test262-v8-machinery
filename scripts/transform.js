#!/usr/bin/env node
'use strict';
var fs = require('fs');
var transform = require('./transform/index');

var firstArg = process.argv[2];
var inPlace = false;
var usage = [
  'Usage: transform.js [-i, --in-place] TESTFILE',
  'Translate the V8 unit test TESTFILE into a Test262-compatable format. The',
  'result will be printed to standard out unless the "in-place" flag is ',
  'present.'
].join('\n');
var src, outStream;

if (process.argv.length < 3 || process.argv.length > 5) {
  console.log(usage);
  process.exit(1);
}

if (firstArg === '-h' || firstArg === '--help') {
  console.log(usage);
  process.exit(0);
}

if (firstArg === '-i' || firstArg === '--in-place') {
  inPlace = true;
  src = fs.readFileSync(process.argv[3]);
  outStream = fs.createWriteStream(process.argv[3]);
} else {
  src = fs.readFileSync(process.argv[2]);
  outStream = process.stdout;
}

outStream.write(transform(src));
