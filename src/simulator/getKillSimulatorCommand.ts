export function getKillSimulatorCommand(
  platform: NodeJS.Platform = process.platform
): string {
  switch (platform) {
    case "darwin":
      return 'killall "Playdate Simulator"';
    case "win32":
      return "taskkill /IM PlaydateSimulator.exe";
    case "linux":
      return "(pidof PlaydateSimulator | xargs -r kill -9)";
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}
