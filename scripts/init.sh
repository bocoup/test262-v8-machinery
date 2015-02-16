#!/usr/bin/env bash

cd test262
git remote add upstream git@github.com:tc39/test262.git

cd  ../v8-git-mirror
git remote add upstream git@github.com:v8/v8-git-mirror.git

cd ..
git remote add upstream git@github.com:bocoup/test262-v8-machinery.git;

npm install
