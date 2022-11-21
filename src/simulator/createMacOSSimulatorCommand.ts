import * as path from "path";

import { quote } from "../util";

export interface CreateMacOSSimulatorCommandOptions {
  sdkPath: string;
  openGamePath?: string;
}

export function createMacOSSimulatorCommand({
  sdkPath,
  openGamePath: gamePath,
}: CreateMacOSSimulatorCommandOptions): string {
  const simulatorPath = path.resolve(sdkPath, "bin", "Playdate Simulator.app");
  const args = ["-a", quote(simulatorPath)];
  if (gamePath) {
    args.push(quote(gamePath));
  }
  return `/usr/bin/open ${args.join(" ")}`;
}
