#!/bin/sh
echo "\nType Checking...\n"
## run type check
npm run flow check
echo "\033[42mType Checking Successful!\033[0m\n"
