#!/usr/bin/env bash

function help() {
  cat <<HELP
Usage: analyze [V8DIRECTORY]
Report statistics for ES6 test files in a V8 git repository. If no argument is
specified, the current working directory will be used.
HELP
}

if [[ "$1" == "-h" || "$1" == "--help" ]]; then help; exit; fi

if [ ! -z "$1" ]; then
	pushd $1
fi

sources="test/mjsunit/es6 test/mjsunit/harmony"

head_summary=$(git show --pretty='format:%h %cd %s' --no-patch)

file_count=$(git ls-files $sources | wc -l)
line_count=$(git ls-files -z $sources | xargs --null cat | wc -l)

echo "HEAD:       $head_summary"
echo "File count: $file_count"
echo "Line count: $line_count"

echo "Relative Change Overview"
for relative_date in "1 week ago" "1 month ago" "2 months ago"; do
	echo "  Since $relative_date"

	commit=$(git rev-list -n1 --before="$relative_date" HEAD)

	shortstat=$(git diff $commit --shortstat -- $sources)
	added_count=$(git diff $commit --diff-filter=A --name-only -- $sources | wc -l)
	deleted_count=$(git diff $commit --diff-filter=D --name-only -- $sources | wc -l)
	changed_count=$(git diff $commit --diff-filter=MT --name-only -- $sources | wc -l)

	echo "    $shortstat"
	echo "    Files Added:   $added_count"
	echo "    Files Removed: $deleted_count"
	echo "    Files Changed: $changed_count"
done

if [ ! -z "$1" ]; then
	popd
fi
