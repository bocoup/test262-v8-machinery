#!/usr/bin/env bash

set -e

if [[ $EDITOR == "" ]]; then
  EDITOR=$(git config core.editor)
fi

# Prepare a commit message that includes a listing of files removed from V8
MSG_FILE=.git/TEST262_COMMIT_EDITMSG

FILES=$(cd v8-git-mirror; git diff master --name-status | sed 's/^[^D].*$//g' | sed 's/^D\s*//g')

cat << EOF > $MSG_FILE
Import tests from Google V8

These tests are derived from the following files within the Google V8
project:

$FILES

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
EOF

gits status | sed 's/^/#/' >> $MSG_FILE

$EDITOR $MSG_FILE > `tty` < `tty`

gits commit $QUOTED_ARGS --message "$(cat $MSG_FILE)" --cleanup strip
