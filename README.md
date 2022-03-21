# VS Code Playdate Debug

Unofficial Playdate debug extension

## Features

- Compile games to `.pdx` using `pdc`
- Problem matchers for `pdc`
- Open the Playdate Simulator
- Debug Lua code running in the Playdate Simulator

## Requirements

- The [Playdate SDK](https://play.date/dev/) must be installed separately

## Basic Configuration

By default, the tasks and launch configuration will attempt to automatically find the Playdate SDK and compiled game name. For this to work, the `PLAYDATE_SDK_PATH` environment must be configured, the [pdxinfo](https://sdk.play.date/1.9.3/Inside%20Playdate.html#pdxinfo) file must exist in your game's `source` directory, and the `name` property must be set in `pdxinfo`.

### tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "pdc",
      "problemMatcher": ["$pdc-lua", "$pdc-external"],
      "label": "Build"
    },
    {
      "type": "playdate-simulator",
      "problemMatcher": ["$pdc-external"],
      "label": "Run"
    },
    {
      "label": "Build and Run",
      "dependsOn": ["Build", "Run"],
      "dependsOrder": "sequence",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

### launch.json

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "playdate",
      "request": "launch",
      "name": "Debug (Simulator)",
      "preLaunchTask": "${defaultBuildTask}"
    }
  ]
}
```

## Advanced Configuration

The default SDK path, game source path, and compiled game path can be overridden in your workspace's `settings.json` file:

```json
{
  "sdkPath": "/path/to/PlaydateSDK",
  "sourcePath": "/path/to/MyGame/source",
  "outputPath": "/path/to/MyGame",
  "productName": "My Game"
}
```

## Known Issues

- Debugging is not supported on Windows or Linux.
- VS Code continues to display a progress bar after connecting to the debugger. The progress bar goes away after a breakpoint is hit.
- Breakpoints are in an unverified state.
- An error message is displayed after clicking the stop button the first time. Clicking the stop button a second time correctly stops the game in the Simulator.
- Stepping into C functions causes the debugger to continue executing.
- The debugger might start before the Playdate Simulator debug port is available. The `timeout` property on the `playdate-simulator` task can be used to wait for the debug port to become available. Alternatively, you can open the Playdate Simulator manually.
- The `.pdx` bundle might not be visible to the Playdate Simulator immediately after the `pdc` task completes. The `timeout` property on the `pdc` task can be used to wait for the `.pdx` bundle to become available.
