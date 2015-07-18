#!/bin/bash

APPINFO_VAR="appinfo"
APPINFO="appinfo.json"
SOURCE_JS="config/config.js"
DESTINATION_DIR="src/js/"
DESTINATION_JS="pebble-js-app.js"
COMMENT="// File generated automatically from files in /config. Do not change this file as it will be replaced"

set -f
# Create js directory in src.
mkdir -p $DESTINATION_DIR
# Write the comment to the file, overwriting its contents.
echo $COMMENT > $DESTINATION_DIR$DESTINATION_JS
# Append the appinfo file to the js
echo var $APPINFO_VAR = $(cat $APPINFO)\; >> $DESTINATION_DIR$DESTINATION_JS
# Append the rest of the JS to the file.
cat $SOURCE_JS >> $DESTINATION_DIR$DESTINATION_JS

