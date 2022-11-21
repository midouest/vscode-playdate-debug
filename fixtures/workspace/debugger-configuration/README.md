# Debugger Configuration

This project demonstrates the extra configuration options that the `playdate` debug launcher supports.

## Launch

The [`launch.json`](/.vscode/launch.json) file specifies the following additional properties from the `playdate` debug launcher:

- `"maxRetries": 10` sets the maximum number of times that the debug launcher will attempt to connect to the Playdate Simulator before aborting. This property defaults to `25`.
- `"retryTimeout": 100` controls how long the debug launcher waits between attempts to connect to the Playdate Simulator. This property defaults to `200`.

### Development

The following additional properties are supported for development use-cases:

- `"disableWorkarounds": true` disables all debug adapter proxy patches. The default behavior is to only disable patches when the SDK version is 1.13.0 or later. This property defaults to `false`.
- `"logDebugAdapter": true` logs messages between VSCode and the Playdate Simulator during debugging. These messages can be viewed in the `Playdate Debug` Output tab. This behavior is only active when the SDK version is earlier than 1.13.0 and the `disableWorkarounds` property is `false`. This property defaults to `false`.
