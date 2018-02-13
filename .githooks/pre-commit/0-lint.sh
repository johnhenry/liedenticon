
#!/bin/sh
echo "\nLinting code...\n"

# Get .js and .jsx file
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep ".jsx\{0,1\}$")

if [[ "$STAGED_FILES" = "" ]]; then
  exit 0
fi

PASS=true

for FILE in $STAGED_FILES
do

  # Skip files not in flow directory
  if [[ "$FILE" != "flow/"* ]]; then
    continue
  fi

  #fix file
  echo "fixing $FILE"
  npm run fix "$FILE"

  if [[ "$?" == 0 ]]; then
    echo "\t\033[32mESLint Passed: $FILE\033[0m"
  else
    echo "\t\033[41mESLint Failed: $FILE\033[0m"
    PASS=false
  fi
done

if ! $PASS; then
  echo "\033[41mCOMMIT FAILED:\033[0m Your commit contains files that should pass ESLint but do not. Please fix the ESLint errors and try again.\n"
  exit 1
else
  echo "\033[42mLinting Successful!\033[0m\n"
fi

exit $?