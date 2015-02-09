# test262-v8-machinery

Tooling to assist in the process of re-implementing JavaScript language tests
from [Google's V8 project]() to [ECMA's Test262 project]().

## Setup

This repository serves as a superproject to Bocoup's forks of V8 and Test262.
Because of this, the repo shouldn't be cloned using `git clone` directly.
Instead, follow these steps:

1. Install `git-slave`: http://gitslave.sourceforge.net/
2. Clone this repository: `gits clone
   git@github.com:bocoup/test262-v8-machinery.git`

## Workflow

Use the `gits` wrapper and a few simple Bash scripts to synchronize changes
across the V8 and Test262 projects.

1. Create a migration branch.

      $ gits checkout -b migration-twenty-three

2. Use the `scripts/migrate.sh` executable to move a test file from the V8
   project into the Test262 project. This will automatically apply some simple
   transformations necessary to run the tests in the Test262 harness.

      $ ./scripts/migrate.sh \
          v8-git-mirror/test/mjsunit/es6/json.js \
          test262/test/built-ins/JSON/new-stuff.js

3. Update the new test file to fit more naturally in the Test262 test suite.
   This can be done with any editor and may include:

   - removing assertions for V8 internals
   - modifying code style
   - re-factoring the tests to span multiple files

4. Add the changes from each sub-project.

      $ gits add --all .

4. Commit the changes.

      $ ./scripts/commit.sh

5. Publish your work!

     $ gits push origin migration-twenty-three

## License

Copyright (c) 2015 Bocoup  
Licensed under the MIT Expat license.
