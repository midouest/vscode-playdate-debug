#!/usr/bin/env bash

set -euxo pipefail

mkdir tmp
cd tmp

wget https://download.panic.com/playdate_sdk/Linux/PlaydateSDK-latest.tar.gz
rm -rf ../fixtures/PlaydateSDK
mkdir ../fixtures/PlaydateSDK
tar --strip-components 1 -xzf PlaydateSDK-latest.tar.gz -C ../fixtures/PlaydateSDK/
