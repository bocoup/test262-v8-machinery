#!/usr/bin/env bash

function help() {
  cat <<HELP
Usage: transform.sh [-i, --in-place] TESTFILE
Translate the V8 unit test TESTFILE into a Test262-compatable format. The
result will be printed to standard out unless the "in-place" flag is present.
HELP
}

TEST_FILE=$1
if [[ "$1" == "-i" || "$1" == "--in-place" ]]; then
  TEST_FILE=$2
  IN_PLACE=1
fi

if [[ "$1" == "-h" || "$1" == "--help" ]]; then help; exit; fi

if [[ "$TEST_FILE" == "" ]]; then help; exit 1; fi

read -r -d '' FRONTMATTER <<FRONTMATTER
/*---
 includes: [v8-mjsunit.js]
 ---*/
FRONTMATTER

TRANSFORMED=$(echo "$FRONTMATTER" | cat - $TEST_FILE)

if [[ $IN_PLACE -eq 1 ]]; then
  echo "$TRANSFORMED" > $TEST_FILE
else
  echo "$TRANSFORMED"
fi
