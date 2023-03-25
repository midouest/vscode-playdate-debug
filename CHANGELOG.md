# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

### Fixed

- The Linux simulator task correctly handles game paths with spaces

## [1.14.0] - 2023-02-14

### Changed

- Extension no longer launches simulator in gnome-terminal on Linux

## [1.12.0] - 2023-02-10

### Changed

- Extended default timeout to 10 seconds

### Fixed

- Extension waits for simulator to launch before connecting to debug adapter in SDK 1.13

## [1.10.0] - 2023-01-08

### Changed

- Run/debug editor contents command stops running playdate debug sessions

### Fixed

- `incrementBuildNumber` only outputs keys that are present in the original file

## [1.9.1] - 2022-12-10

### Fixed

- Clean up correctly after run/debug current file

## [1.9.0] - 2022-12-10

### Added

- `incrementBuildNumber` configuration option on `pdc` task will auto-increment the pdxinfo buildNumber property after each successful build
- `outputPath` workspace configuration option can be used to output to `/Disk/Games` folder in the Playdate SDK

## [1.8.2] - 2022-11-21

### Added

- Run and debug current Lua file as main.lua

### Changed

- Display error messages from commands and tasks
- Completely disable proxy server when disableWorkarounds is enabled

### Fixed

- Problem matchers correctly match absolute file paths
- Example project links in readme link to project folders

## [1.7.0] - 2022-11-19

### Added

- Support for multi-root workspaces

### Changed

- Completely disable proxy server for SDK version 1.13.0 or later
- Streamlined quick setup in README

### Fixed

- Check PLAYDATE_SDK_PATH environment variable before checking ~.Playdate/config

## [1.6.0] - 2022-11-18

### Added

- Relative paths in settings.json are now resolved from the workspace root
- Breakpoints are in a verified state

### Changed

- Only check for ~/.Playdate on macOS
- Automatically disable workarounds in SDK version 1.13.0 and later
- Extension now waits up to 5 seconds to connect by default

### Fixed

- PDC task sends correct CLI flag for skipUnknown setting
- PDC task always sends -sdkpath

## [1.5.1] - 2022-11-14

### Changed

- Log task commands before they are executed

### Fixed

- Increased maximum number of retries and retry timeout when attempting to connect to the Playdate Simulator. The extension now waits up to 4 seconds to connect by default.
- Log proxied messages before attempting to decode them
- Fixed an issue where the extension incorrectly decoded debug adapter messages sent from Visual Studio Code v1.73+

## [1.5.0] - 2022-10-13

### Added

- Retry timeout and maximum number of retries are configurable in launch.json

### Fixed

- Increased maximum number of retries when attempting to connect to the Playdate Simulator

## [1.4.1] - 2022-09-28

### Fixed

- Fix incorrect settings in docs

## [1.4.0] - 2022-09-06

### Added

- Ensure VSCode UI resets when restarting after an exception occurs
- `pdc` task supports strip, no-compress, verbose, quiet and skip-unknown flags

### Removed

- `timeout` property on `pdc` task

### Fixed

- `pdc` task compiles to fully-resolved `.pdx` path instead of output folder
- Account for `pdc` binary path with spaces - [@NobleRobot](https://github.com/NobleRobot)

## [1.3.2] - 2022-08-01

### Changed

- README contains link to template project

## [1.3.1] - 2022-07-05

### Changed

- `pdc` task no longer requires `pdc` command to be in the `PATH` variable

## [1.3.0] - 2022-07-02

### Added

- `disableWorkarounds` property on launch configuration to disable workarounds for issues communicating between VSCode and the Playdate Simulator.

## [1.2.0] - 2022-07-02

### Added

- `logDebugAdapter` property on launch configuration to log communication between VSCode and the Playdate Simulator

## [1.1.3] - 2022-07-01

### Fixed

- Fix invalid variable attributes error when debugging

## [1.1.2] - 2022-04-23

### Fixed

- Fix segmentation fault in `playdate-simulator` task on Ubuntu

## [1.1.1] - 2022-04-22

### Changed

- `pdc` and `playdate-simulator` tasks log internal errors to the terminal

## [1.1.0] - 2022-03-25

### Added

- `kill` property to `playdate-simulator` which kills running simulator instances before starting a new one

## [1.0.0] - 2022-03-23

### Added

- Extension icon

## [0.3.0] - 2022-03-23

### Added

- `playdate-simulator` task accepts optional `openGame` parameter

### Changed

- `playdate-simulator` task opens the game by default on macOS

### Removed

- Removed `timeout` property on `playdate-simulator` task

### Fixed

- Fix issue where debugger did not stop after Simulator was closed
- Debugger proxy server waits for simulator port before starting

## [0.2.3] - 2022-03-22

### Fixed

- Fix issue where debugger only connected the first time

## [0.2.2] - 2022-03-22

### Changed

- Moved task configuration properties to workspace settings under `playdate-debug` section
- Remove waitFor configuration in tasks in favor of simple timeouts

### Fixed

- Workaround bugs in the Playdate Simulator debug adapter protocol by proxying messages to/from VS Code

## [0.2.1] - 2022-03-20

### Fixed

- Fix simulator task not accepting extra task properties
- Fix simulator task starting before game bundle was created
- Fix uncaught exception when not able to connect to simulator debug port

## [0.2.0] - 2022-03-19

### Added

- pdc task type
- playdate-simulator task type

### Fixed

- fix preLaunchTask not running when using playdate debugger

## [0.1.0] - 2022-03-16

### Added

- Extension attempts to automatically resolve sdkPath, sourcePath and gamePath configuration

## [0.0.2] - 2022-03-15

### Added

- README contains an example launch.json configuration

## [0.0.1] - 2022-03-15

### Added

- Initial debug server adapter
