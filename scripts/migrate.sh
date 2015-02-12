#!/usr/bin/env bash

set -e

SCRIPTS_DIR=$(dirname $0)

function help() {
  cat <<HELP
Usage: migrate.sh [--no-transform] SOURCE_FILE DESTINATION_FILE
Move the SOURCE_FILE to DESTINATION_FILE, applying the transformation described
by this project's "transform.sh" script.
HELP
}

SOURCE_FILE=$1
DESTINATION_FILE=$2
if [[ "$1" == "--no-transform" ]]; then
  SOURCE_FILE=$2
  DESTINATION_FILE=$3
  NO_TRANSFORM=1
fi

if [[ "$1" == "-h" || "$1" == "--help" ]]; then help; exit; fi

if [[ "$SOURCE_FILE" == "" || "$DESTINATION_FILE" == "" ]]; then
  help;
  exit 1;
fi

cp $SOURCE_FILE $DESTINATION_FILE
rm $SOURCE_FILE

if [[ ! $NO_TRANSFORM -eq 1 ]]; then
  $SCRIPTS_DIR/transform.js --in-place $DESTINATION_FILE
fi
