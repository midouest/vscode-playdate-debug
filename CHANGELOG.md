# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `playdate-simulator` task accepts optional `openGame` parameter

### Changed

- `playdate-simulator` task opens the game by default on macOS
- Fix issue where debugger did not stop after Simulator was closed
- `playdate-simulator` task timeout defaults to 250ms when set

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
