import * as path from "path";
import * as child_process from "child_process";

import { exec, isExecError } from "./exec";
import { quote } from "./quote";
import { TaskRunner } from "./TaskRunner";
import { wait } from "./wait";
import { ConfigurationResolver } from "./ConfigurationResolver";

export interface SimulatorTaskRunnerOptions {
  timeout?: number;
}

const PLAYDATE_SIMULATOR_EXE_RE = /PlaydateSimulator\.exe/g;

export class SimulatorTaskRunner implements TaskRunner {
  constructor(
    private config: ConfigurationResolver,
    private options: SimulatorTaskRunnerOptions
  ) {}

  async run(): Promise<string | undefined> {
    const { timeout } = this.options;
    const { sdkPath, gamePath } = await this.config.resolve();

    switch (process.platform) {
      case "darwin":
        // TODO: handle undefined
        return this.openMacOS(sdkPath, gamePath, timeout);

      case "win32":
        // TODO: handle undefined
        return this.openWin32(sdkPath, gamePath);

      default:
        return `error: platform '${process.platform}' is not supported`;
    }
  }

  private async openMacOS(
    sdkPath: string,
    gamePath?: string,
    timeout?: number
  ): Promise<string | undefined> {
    const simulatorPath = path.resolve(
      sdkPath,
      "bin",
      "Playdate Simulator.app"
    );
    const args = ["-a", quote(simulatorPath)];
    // TODO: task configuration
    // if (gamePath) {
    //   args.push(quote(gamePath));
    // }
    const command = `/usr/bin/open ${args.join(" ")}`;

    try {
      await exec(command);
    } catch (err) {
      if (isExecError(err)) {
        return err.stderr;
      }
    }

    if (!timeout) {
      return;
    }

    await wait(timeout);
  }

  private async openWin32(
    sdkPath: string,
    gamePath?: string
  ): Promise<string | undefined> {
    try {
      const { stdout } = await exec("tasklist");
      if (stdout.match(PLAYDATE_SIMULATOR_EXE_RE)) {
        return;
      }
    } catch (err) {
      if (isExecError(err)) {
        return err.stderr;
      }
      return;
    }

    const simulatorPath = path.resolve(sdkPath, "bin", "PlaydateSimulator.exe");
    const args = gamePath ? [quote(gamePath)] : [];

    const child = child_process.spawn(quote(simulatorPath), args, {
      shell: true,
      detached: true,
      stdio: "ignore",
    });
    child.unref();
  }
}
