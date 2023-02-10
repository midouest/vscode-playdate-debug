#!/usr/bin/env bash

set -euxo pipefail

VERSION=${1:-1.12.3}
PLAYDATE_SDK=PlaydateSDK-${VERSION}

rm -rf tmp/${VERSION}
mkdir -p tmp/${VERSION}
cd tmp/${VERSION}

wget https://download.panic.com/playdate_sdk/${PLAYDATE_SDK}.zip
unzip ${PLAYDATE_SDK}.zip

PKG_FILE="${PLAYDATE_SDK}.pkg"
if [[ -f "PlaydateSDK.pkg" ]]; then
    PKG_FILE="PlaydateSDK.pkg"
fi

mkdir out
xar -xf "${PKG_FILE}" -C out
cat out/PlaydateSDK.pkg/Payload | gunzip -dc | cpio -i
rm -rf ../../fixtures/${PLAYDATE_SDK}
mv PlaydateSDK ../../fixtures/${PLAYDATE_SDK}
