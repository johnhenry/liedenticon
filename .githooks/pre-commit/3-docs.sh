#!/bin/sh
echo "\nCreating documentation...\n"
npm run docs
git add docs/api.md
git add docs/readme.md
echo "\033[42mDocumentation successfully created!\033[0m\n"