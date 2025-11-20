#!/bin/bash
# Script to load .env variables before running npm commands

# Load .env file
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Run npm with all passed arguments
npm "$@"
