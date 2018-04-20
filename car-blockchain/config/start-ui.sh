#!/usr/bin/env bash
echo $PWD
cd /car-blockchain
echo $PWD
#npm install
echo NPM install finished!
echo $PWD
node_modules/.bin/clap build
echo Clap build finished!
npm run prod
