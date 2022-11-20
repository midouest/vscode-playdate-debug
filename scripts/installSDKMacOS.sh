#!/usr/bin/env bash

set -euxo pipefail

VERSION=1.12.3
PLAYDATE_SDK=PlaydateSDK-${VERSION}

mkdir tmp
cd tmp

wget https://download.panic.com/playdate_sdk/${PLAYDATE_SDK}.zip
unzip ${PLAYDATE_SDK}.zip
xar -xf ${PLAYDATE_SDK}.pkg
cat PlaydateSDK.pkg/Payload | gunzip -dc | cpio -i
rm -rf ../fixtures/${PLAYDATE_SDK}
mv PlaydateSDK ../fixtures/${PLAYDATE_SDK}
