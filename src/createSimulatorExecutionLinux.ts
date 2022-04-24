import * as path from "path";

import * as vscode from "vscode";

import { TaskExecution } from "./TaskExecutionFactory";
import { quote } from "./quote";

/**
 * SimulatorExecutionLinuxOptions contains extra properties asigned to the
 * `playdate-simulator` task in `tasks.json`.
 */
export interface SimulatorExecutionLinuxOptions {
  sdkPath: string;
  openGamePath?: string;
  kill?: boolean;
}

/**
 * createSimulatorExecutionLinux creates a shell execution that launches the
 * Playdate Simulator executable if it is not already running.
 *
 * **NOTE:** createSimulatorExecutionLinux creates a shell execution instead of
 * a custom execution with a detached child process. Starting the Playdate
 * Simulator in a detached child process from a custom execution causes a
 * segmentation fault for unknown reasons.
 */
export async function createSimulatorExecutionLinux(
  options: SimulatorExecutionLinuxOptions
): Promise<TaskExecution> {
  const { sdkPath, openGamePath, kill } = options;

  const simulatorPath = path.resolve(sdkPath, "bin", "PlaydateSimulator");
  const args = openGamePath ? [openGamePath] : [];

  const commands = [
    `gnome-terminal -- ${quote(simulatorPath)} ${args.join(" ")}`,
  ];

  let command: string;
  if (kill) {
    commands.splice(0, 0, "(pidof PlaydateSimulator | xargs -r kill -9)");
    command = commands.join(" && ");
  } else {
    commands.splice(0, 0, "pidof PlaydateSimulator");
    command = commands.join(" || ");
  }
  return new vscode.ShellExecution(command);
}
