import * as path from "path";
import * as child_process from "child_process";

import * as vscode from "vscode";

import { getSDKPath } from "./getSDKPath";
import { exec, isExecError } from "./exec";
import { waitForDebugPort } from "./waitForDebugPort";
import { DEBUG_PORT } from "./constants";

export interface PlaydateSimulatorTaskTerminalOptions {
  workspaceRoot: string;
  sdkPath?: string;
  gamePath?: string;
  debug?: boolean;
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
      this.writeEmitter.fire(errorMessage);
      status = 1;
    }
    this.closeEmitter.fire(status);
  }
}

async function openPlaydateSimulator(
  options: PlaydateSimulatorTaskTerminalOptions
): Promise<string | undefined> {
  let { sdkPath, gamePath, debug } = options;
  if (!sdkPath) {
    sdkPath = await getSDKPath();
  }

  debug = debug || debug === undefined;

  switch (process.platform) {
    case "darwin":
      return openMacOS(sdkPath, gamePath);

    case "win32":
      return openWin32(sdkPath, gamePath);

    default:
      throw new Error(`error: platform '${process.platform}' is not supported`);
  }
}

async function openMacOS(
  sdkPath: string,
  gamePath?: string,
  debug?: boolean
): Promise<string | undefined> {
  const simulatorPath = path.resolve(sdkPath, "bin", "Playdate Simulator.app");
  const args = ["-a", `"${simulatorPath}"`];
  if (gamePath) {
    args.push(`"${gamePath}`);
  }
  const command = `/usr/bin/open ${args.join(" ")}`;

  try {
    await exec(command);
  } catch (err) {
    if (isExecError(err)) {
      return err.stderr;
    }
  }

  if (debug) {
    await waitForDebugPort(DEBUG_PORT);
  }
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
  const args = gamePath ? [gamePath] : [];

  const child = child_process.spawn(simulatorPath, args, {
    shell: true,
    detached: true,
    stdio: "ignore",
  });
  child.unref();
}
