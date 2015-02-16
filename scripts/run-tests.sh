#!/usr/bin/env bash

RUNNER=tools/packaging/test262.py
RUNTIME=v8-git-mirror/out/native/d8

function help() {
  cat <<HELP
Usage: run-tests.sh TEST_PATTERN
Execute the Test262 tests described by TEST_PATTERN using the locally-built
version of V8.
HELP
}

if [[ "$1" == "-h" || "$1" == "--help" ]]; then help; exit; fi

if [ -z "$1" ]; then help; exit 1; fi

if [ ! -f $RUNTIME ]; then
  echo "Could not find local V8 executable."
  exit 1
fi

(cd test262; $RUNNER --command ../$RUNTIME $1)
