# Contributing

## Test Suite

The test suite selects subsets of tests to run based on the host operating system and the presence of the Playdate SDK.

To run tests against an actual Playdate SDK, copy or install the Playdate SDK to the [fixtures/PlaydateSDK](/fixtures/PlaydateSDK) directory. Tests that depend on an actual Playdate SDK will only run on macOS.

The [`intallSDKLinux.sh`](/scripts/installSDKLinux.sh) and [`installSDKMacOS.sh`](/scripts/installSDKMacOS.sh) scripts can be used to automatically download and install the Playdate SDK in the fixtures directory on Linux and macOS, respectively.
