#!/bin/sh
# Allows us to read user input below, assigns stdin to keyboard
exec < /dev/tty

while true; do
  read -p "Finalize this commit? (y/n)" yn
  if [ "$yn" = "" ]; then
    yn='Y'
  fi
  case $yn in
      [Yy] ) break;;
      [Nn] ) exit 1;;
      * ) echo "Please answer y or n for yes or no.";;
  esac
done