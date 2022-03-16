# VS Code Playdate Debug

Unofficial Playdate debug extension

## Configuration

The Playdate Simulator must be launched manually before launching the debugger.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "playdate",
      "request": "launch",
      "name": "Debug (Simulator)",
      "sdkPath": "/path/to/PlaydateSDK",
      "sourcePath": "/path/to/MyGame/source",
      "gamePath": "/path/to/MyGame/MyGame.pdx"
    }
  ]
}
```

## Known Issues

- VS Code continues to display a progress bar after connecting to the debugger. The progress bar goes away after a breakpoint is hit.
- Breakpoints are in an unverified state.
- An error message is displayed after clicking the stop button the first time. Clicking the stop button a second time correctly stops the game in the Simulator.
