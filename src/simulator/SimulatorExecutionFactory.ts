import { inject, injectable } from "inversify";
import * as vscode from "vscode";

import {
  TaskRunnerTerminal,
  TaskExecution,
  TaskExecutionFactory,
  ConfigurationResolver,
} from "../core";

import { SimulatorMacOSTaskRunner } from "./SimulatorMacOSTaskRunner";
import { SimulatorWin32TaskRunner } from "./SimulatorWin32TaskRunner";
import { createSimulatorExecutionLinux } from "./createSimulatorExecutionLinux";

/**
 * The SimulatorExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `playdate-simulator` task.
 */
@injectable()
export class SimulatorExecutionFactory implements TaskExecutionFactory {
  constructor(
    @inject(ConfigurationResolver)
    private config: ConfigurationResolver
  ) {}

  async createExecution(
    definition: vscode.TaskDefinition,
    scope: vscode.WorkspaceFolder | vscode.TaskScope
  ): Promise<TaskExecution | undefined> {
    const config = await this.config.resolve(scope);
    if (!config) {
      return undefined;
    }

    const { openGame, kill } = definition;
    const { sdkPath, gamePath } = config;
    const openGamePath = openGame !== false ? gamePath : undefined;

    switch (process.platform) {
      case "darwin": {
        const runner = new SimulatorMacOSTaskRunner({
          sdkPath,
          openGamePath,
          kill,
        });
        return new vscode.CustomExecution(
          async () => new TaskRunnerTerminal(runner)
        );
      }

      case "win32": {
        const runner = new SimulatorWin32TaskRunner({
          sdkPath,
          openGamePath,
          kill,
        });
        return new vscode.CustomExecution(
          async () => new TaskRunnerTerminal(runner)
        );
      }

      case "linux": {
        return await createSimulatorExecutionLinux({
          sdkPath,
          openGamePath,
          kill,
        });
      }

      default:
        throw new Error(
          `error: platform '${process.platform}' is not supported`
        );
    }
  }
}
