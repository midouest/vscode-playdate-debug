import * as path from "path";

import { quote } from "../util";

export interface GetMacOSSimulatorCommandOptions {
  sdkPath: string;
  openGamePath?: string;
}

export function getMacOSSimulatorCommand({
  sdkPath,
  openGamePath: gamePath,
}: GetMacOSSimulatorCommandOptions): string {
  const simulatorPath = path.resolve(sdkPath, "bin", "Playdate Simulator.app");
  const args = ["-a", quote(simulatorPath)];
  if (gamePath) {
    args.push(quote(gamePath));
  }
  return `/usr/bin/open ${args.join(" ")}`;
}
