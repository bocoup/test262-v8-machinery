#!/usr/bin/env bash

SCRIPTS_DIR=$(dirname $0)

function help() {
  cat <<HELP
Usage: migrate.sh [--no-transform] SOURCE_FILE DESTINATION_FILE
Move the SOURCE_FILE to DESTINATION_FILE, applying the transformation described
by this project's "transform.js" script.
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

if [[ $? -ne 0 ]]; then
  echo "Error: Couldn't copy $SOURCE_FILE to $DESTINATION_FILE"
  exit 1;
fi

if [[ ! $NO_TRANSFORM -eq 1 ]]; then
  $SCRIPTS_DIR/transform.js --in-place $DESTINATION_FILE

  if [[ $? -ne 0 ]]; then
    echo "Error: Could not transform $SOURCE_FILE"
    rm $DESTINATION_FILE
    exit 1;
  fi
fi

rm $SOURCE_FILE
