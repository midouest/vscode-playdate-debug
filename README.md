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
      "label": "Open Simulator"
    },
    {
      "label": "Build and Open Simulator",
      "dependsOn": ["Build", "Open Simulator"],
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
      "preLaunchTask": "Build and Open Simulator"
    }
  ]
}
```

## Advanced Configuration

The default SDK path, game source path, and compiled game path can be overridden for each task and the launch configuration using the following properties:

- `sdkPath`: Path to the Playdate SDK
- `sourcePath`: Path to the game's source directory
- `outputPath`: Path to the output directory that will be created by the compiler. This path should NOT include the .pdx extension
- `gamePath`: Path to the compiled game .pdx bundle

Only a subset of these options are supported on each task and the launch configuration. See the configuration auto-complete for more information.

The `playdate-simulator` task type supports an additional parameter, `debug`. When set to `true`, this property causes the task to wait for the Playdate Simulator debugger to respond before completing. This is useful for preventing the debug launch configuration from starting before the Playdate Simulator is ready to accept debug connections. This property defaults to `true`. This property currently has no effect on Windows.

## Known Issues

- Debugging is not supported on Windows or Linux.
- VS Code continues to display a progress bar after connecting to the debugger. The progress bar goes away after a breakpoint is hit.
- Breakpoints are in an unverified state.
- An error message is displayed after clicking the stop button the first time. Clicking the stop button a second time correctly stops the game in the Simulator.
- Stepping into C functions causes the debugger to continue executing.
