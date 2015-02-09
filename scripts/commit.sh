#!/usr/bin/env bash

# Prepare a commit message that includes a listing of files removed from V8

FILES=$(cd v8-git-mirror; git diff master --name-status | sed 's/^[^D].*$//g' | sed 's/^D\s*//g')

MESSAGE=$(cat <<EOF
Import tests from Google V8

These tests are derived from the following files within the Google V8
project:

$FILES
EOF
)

gits commit --message "$MESSAGE" $@
