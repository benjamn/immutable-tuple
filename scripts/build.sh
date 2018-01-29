#!/usr/bin/env bash

cd $(dirname $0)

rollup -c ./rollup/config.js
rollup -c ./rollup/config-min.js
rollup -c ./rollup/config-es.js
