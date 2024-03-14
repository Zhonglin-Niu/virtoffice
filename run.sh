#!/usr/bin/env bash

options=("s" "c")

if [ -z "$1" ]; then
  # print usage ./run.sh [s|c] (from options)
  echo "Usage: ./run.sh [s|c]"
  exit 1
fi

# if input is not in options
if [[ ! " ${options[@]} " =~ " $1 " ]]; then
  echo "Invalid option: $1"
  exit 1
fi

# if input is s
if [ "$1" == "s" ]; then
  echo "Running server"
  cd server/src
  node index.js
  exit 0
fi

# if input is c
if [ "$1" == "c" ]; then
  echo "Running client"
  cd client
  npm run-script build
  npx serve -s build
  exit 0
fi
