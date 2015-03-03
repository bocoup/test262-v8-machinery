# test262-v8-machinery

Tooling to assist in the process of re-implementing JavaScript language tests
from [Google's V8 project]() to [ECMA's Test262 project]().

## Setup

This repository serves as a superproject to Bocoup's forks of V8 and Test262.
Because of this, the repo shouldn't be cloned using `git clone` directly.
Instead, follow these steps:

1. Install [Node.js](https://nodejs.org/)
2. Install `git-slave`: http://gitslave.sourceforge.net/
3. Clone this repository: `gits clone
   git@github.com:bocoup/test262-v8-machinery.git`
4. Install Node.js modules: `npm install`

## Workflow

Use the `gits` wrapper and a few simple Bash scripts to synchronize changes
across the V8 and Test262 projects.

1. Create a migration branch.
  
  ```sh
  $ gits checkout -b migration-twenty-three
  ```

2. Use the `scripts/migrate.sh` executable to move a test file from the V8
   project into the Test262 project. This will automatically apply some simple
   transformations necessary to run the tests in the Test262 harness.

  ```sh
  $ ./scripts/migrate.sh \
      v8-git-mirror/test/mjsunit/es6/json.js \
      test262/test/built-ins/JSON/new-stuff.js
  ```

3. Update the new test file to fit more naturally in the Test262 test suite.
   This can be done with any editor and may include:

   - removing assertions for V8 internals
   - modifying code style
   - re-factoring the tests to span multiple files

4. Verify the new tests pass:

  ```sh
  $ ./scripts/run-tests.sh

  # The above assumes V8 has been built in this project's clone of the project.
  # You may optionally specify a different JavaScript runtime
  $ ./scripts/run-tests.sh js
  ```

5. Add the changes from each sub-project.
  
  ```sh
  $ gits add --all .
  ```

6. Commit the changes.

  ```sh
  $ ./scripts/commit.sh
  ```

7. Publish your work!
  
  ```sh
  $ gits push origin migration-twenty-three
  ```

## License

Copyright (c) 2015 Bocoup  
Licensed under the MIT Expat license.
