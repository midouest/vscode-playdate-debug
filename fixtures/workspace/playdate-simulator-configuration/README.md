# Playdate Simulator Configuration

This project demonstrates the extra configuration options that the `playdate-simulator` task supports.

## Tasks

The [`tasks.json`](/.vscode/tasks.json) file specifies the following additional properties from the `playdate-simulator` task:

- `"openGame": false` will launch the Playdate Simulator without telling it to open a given `.pdx` bundle. The default behavior is to open the `.pdx` bundle derived from the workspace settings and `pdxinfo` file. This property defaults to `false`.
- `"kill": true` will close all existing Playdate Simulator instances before launching a new instance. The default behavior is to not launch a new Playdate Simulator instance if there is already a running instance. This property defaults to `false`.
