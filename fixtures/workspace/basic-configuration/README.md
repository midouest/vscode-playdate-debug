# Basic Configuration Example

This project demonstrates the most basic `playdate-debug` extension configuration.

## Settings

All settings are derived from the `PLAYDATE_SDK_PATH` environment variable and the [pdxinfo](/fixtures/workspace/basic-configuration/source/pdxinfo) file.

## Tasks

[tasks.json](/fixtures/workspace/basic-configuration/.vscode/tasks.json) declares three tasks:

- `Playdate: Build` compiles the source code in the source directory to a .pdx bundle.
- `Playdate: Run` opens the Playdate Simulator.
- `Playdate: Build and Run` calls the previous two commands sequentially.

`Playdate: Build and Run` is configured as the default build task.

## Debug

[launch.json](/fixtures/workspace/basic-configuration/.vscode/launch.json) declares the `Playdate: Debug` launch configuration which connects to the Playdate Simulator and launches the game.

The game will be compiled and opened in the Playdate Simulator prior to debugging by the `preLaunchTask`.
