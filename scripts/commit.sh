#!/usr/bin/env bash

# Prepare a commit message that includes a listing of files removed from V8

TLDR=""

if [[ "$1" != "" ]]; then
  TLDR="($1)"
fi

FILES=$(cd v8-git-mirror; git diff master --name-status | sed 's/^[^D].*$//g' | sed 's/^D\s*//g')

MESSAGE=$(cat <<EOF
Import tests from Google V8 $TLDR

These tests are derived from the following files within the Google V8
project:

$FILES
EOF
)

gits commit --message "$MESSAGE" $@
