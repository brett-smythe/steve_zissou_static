#!/bin/bash

# Setup javascript
mkdir -p ../static/js
./node_modules/.bin/rollup -c
cp build/js/main.min.js ../static/js/

# Setup css
cp -r css/ ../static/
