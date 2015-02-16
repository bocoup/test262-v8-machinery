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
  gits checkout -b migration-twenty-three
  ```

2. Use the `scripts/migrate.sh` executable to move a test file from the V8
   project into the Test262 project. This will automatically apply some simple
   transformations necessary to run the tests in the Test262 harness.

  ```sh
  ./scripts/migrate.sh \
      v8-git-mirror/test/mjsunit/es6/json.js \
      test262/test/built-ins/JSON/new-stuff.js
  ```

3. Update the new test file to fit more naturally in the Test262 test suite.
   This can be done with any editor and may include:

   - removing assertions for V8 internals
   - modifying code style
   - re-factoring the tests to span multiple files

4. Add the changes from each sub-project.
  
  ```sh
  gits add --all .
  ```

4. Commit the changes.

  ```sh
  ./scripts/commit.sh
  ```

5. Publish your work!
  
  ```sh
  gits push origin migration-twenty-three
  ```

## Runtimes

- [io.js](https://iojs.org/en/index.html)
  + via Homebrew: `brew install iojs`
- [Node.js](http://nodejs.org/)
  + via Homebrew: `brew install node`
  + via Apt: `apt-get install nodejs`
- [SpiderMonkey](http://ftp.mozilla.org/pub/mozilla.org/firefox/nightly/latest-trunk/)
- [V8](https://github.com/v8/v8-git-mirror/)
  + via Homebrew: `brew install v8`


## Useful

When using `gits`, it's helpful to have coordinated remotes: 

```sh
cd test262/;
git remote add origin git@github.com:bocoup/test262.git;
git remote add upstream git@github.com:tc39/test262.git;
cd  ..;
cd v8-git-mirror/;
git remote add origin git@github.com:bocoup/v8-git-mirror.git;
git remote add upstream git@github.com:v8/v8-git-mirror.git;
cd ..;
git remote add origin git@github.com:bocoup/test262-v8-machinery.git;
git remote add upstream git@github.com:bocoup/test262-v8-machinery.git;
```

This will allow convenient syncing: 

Eg. 

```sh
gits pull --rebase upstream master
```

## License

Copyright (c) 2015 Bocoup  
Licensed under the MIT Expat license.
