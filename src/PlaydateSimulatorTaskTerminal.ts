import * as path from "path";
import * as child_process from "child_process";

import * as vscode from "vscode";

import { getSDKPath } from "./getSDKPath";
import { exec, isExecError } from "./exec";
import { PLAYDATE_DEBUG_SECTION } from "./constants";
import { quote } from "./quote";
import { getPDXInfo } from "./getPDXInfo";
import { getSourcePath } from "./getSourcePath";
import { wait } from "./wait";

export interface PlaydateSimulatorTaskTerminalOptions {
  workspaceRoot: string;
  timeout?: number;
}

export class PlaydateSimulatorTaskTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  onDidWrite: vscode.Event<string> = this.writeEmitter.event;

  private closeEmitter = new vscode.EventEmitter<number>();
  onDidClose?: vscode.Event<number> = this.closeEmitter.event;

  constructor(private options: PlaydateSimulatorTaskTerminalOptions) {}

  open(_initialDimensions: vscode.TerminalDimensions | undefined): void {
    this.run();
  }

  close(): void {
    // noop
  }

  private async run(): Promise<void> {
    const errorMessage = await openPlaydateSimulator(this.options);
    let status = 0;
    if (errorMessage) {
      this.writeEmitter.fire(errorMessage + "\n");
      status = 1;
    }
    this.closeEmitter.fire(status);
  }
}

async function openPlaydateSimulator(
  options: PlaydateSimulatorTaskTerminalOptions
): Promise<string | undefined> {
  const { workspaceRoot, timeout } = options;
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
      return openMacOS(sdkPath, gamePath, timeout);

    case "win32":
      return openWin32(sdkPath, gamePath);

    default:
      return `error: platform '${process.platform}' is not supported`;
  }
}

async function openMacOS(
  sdkPath: string,
  gamePath?: string,
  timeout?: number
): Promise<string | undefined> {
  const simulatorPath = path.resolve(sdkPath, "bin", "Playdate Simulator.app");
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

const PLAYDATE_SIMULATOR_EXE_RE = /PlaydateSimulator\.exe/g;

async function openWin32(
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
