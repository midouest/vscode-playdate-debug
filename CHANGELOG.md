# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

### Added

- Ensure VSCode UI resets when restarting after an exception occurs

### Removed

- `timeout` property on `pdc` task

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

### Changed

- Fix invalid variable attributes error when debugging

## [1.1.2] - 2022-04-23

### Changed

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
- Fix issue where debugger did not stop after Simulator was closed
- Debugger proxy server waits for simulator port before starting
- Removed `timeout` property on `playdate-simulator` task

## [0.2.3] - 2022-03-22

### Changed

- Fix issue where debugger only connected the first time

## [0.2.2] - 2022-03-22

### Changed

- Workaround bugs in the Playdate Simulator debug adapter protocol by proxying messages to/from VS Code
- Moved task configuration properties to workspace settings under `playdate-debug` section
- Remove waitFor configuration in tasks in favor of simple timeouts

## [0.2.1] - 2022-03-20

### Changed

- Fix simulator task not accepting extra task properties
- Fix simulator task starting before game bundle was created
- Fix uncaught exception when not able to connect to simulator debug port

## [0.2.0] - 2022-03-19

### Added

- pdc task type
- playdate-simulator task type

### Changed

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
