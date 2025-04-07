import * as path from "path";

import { quote } from "../util";

export interface GetMacOSSimulatorCommandOptions {
  sdkPath: string;
  openGamePath?: string;
  argv?: string[];
}

export function getMacOSSimulatorCommand({
  sdkPath,
  openGamePath: gamePath,
  argv,
}: GetMacOSSimulatorCommandOptions): string {
  const simulatorPath = path.resolve(sdkPath, "bin", "Playdate Simulator.app");
  const args = ["-a", quote(simulatorPath)];
  if (gamePath) {
    args.push(quote(gamePath));

    if (argv?.length) {
      args.push("--args");
      for (const arg of argv) {
        args.push(quote(arg));
      }
    }
  }
  return `/usr/bin/open ${args.join(" ")}`;
}
