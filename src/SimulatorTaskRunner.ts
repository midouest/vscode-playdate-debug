import * as path from "path";
import * as child_process from "child_process";

import * as vscode from "vscode";

import { PLAYDATE_DEBUG_SECTION } from "./constants";
import { exec, isExecError } from "./exec";
import { getPDXInfo } from "./getPDXInfo";
import { getSDKPath } from "./getSDKPath";
import { getSourcePath } from "./getSourcePath";
import { quote } from "./quote";
import { TaskRunner } from "./TaskRunner";
import { wait } from "./wait";

export interface SimulatorTaskRunnerOptions {
  workspaceRoot: string;
  timeout?: number;
}

const PLAYDATE_SIMULATOR_EXE_RE = /PlaydateSimulator\.exe/g;

export class SimulatorTaskRunner implements TaskRunner {
  constructor(private options: SimulatorTaskRunnerOptions) {}

  async run(): Promise<string | undefined> {
    const { workspaceRoot, timeout } = this.options;

    let { sdkPath, sourcePath, outputPath, productName } =
      vscode.workspace.getConfiguration(PLAYDATE_DEBUG_SECTION);

    if (!sdkPath) {
      sdkPath = await getSDKPath();
    }

    if (!outputPath) {
      outputPath = workspaceRoot;
    }

    if (!sourcePath) {
      sourcePath = await getSourcePath(workspaceRoot);
    }

    if (!productName) {
      const pdxInfo = await getPDXInfo(sourcePath);
      productName = pdxInfo.name;
    }

    const gamePath = path.resolve(outputPath, productName + ".pdx");

    switch (process.platform) {
      case "darwin":
        return this.openMacOS(sdkPath, gamePath, timeout);

      case "win32":
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
