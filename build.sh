#!/bin/bash

#
# This build script is used by Jenkins to build the project
#

npm install
if [ "$?" -ne "0" ]; then echo "[build.sh] npm install failure"; exit 1; fi

npm test

if [ "$?" -ne "0" ]; then echo "[build.sh] grunt failure"; exit 1; fi

if [ $? -ne 0 ]; then
  echo "[build.sh] failure"
  exit 1
else
  echo "[build.sh] done"
fi
