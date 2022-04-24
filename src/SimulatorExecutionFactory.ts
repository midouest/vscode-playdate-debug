import * as vscode from "vscode";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { SimulatorMacOSTaskRunner } from "./SimulatorMacOSTaskRunner";
import { SimulatorWin32TaskRunner } from "./SimulatorWin32TaskRunner";
import { TaskExecution, TaskExecutionFactory } from "./TaskExecutionFactory";
import { TaskRunnerTerminal } from "./TaskRunnerTerminal";
import { createSimulatorExecutionLinux } from "./createSimulatorExecutionLinux";

/**
 * The SimulatorExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `playdate-simulator` task.
 */
export class SimulatorExecutionFactory implements TaskExecutionFactory {
  constructor(private config: ConfigurationResolver) {}

  async createExecution(
    definition: vscode.TaskDefinition
  ): Promise<TaskExecution> {
    const { openGame, kill } = definition;

    switch (process.platform) {
      case "darwin": {
        const runner = new SimulatorMacOSTaskRunner(this.config, {
          openGame,
          kill,
        });
        return new vscode.CustomExecution(
          async () => new TaskRunnerTerminal(runner)
        );
      }

      case "win32": {
        const runner = new SimulatorWin32TaskRunner(this.config, {
          openGame,
          kill,
        });
        return new vscode.CustomExecution(
          async () => new TaskRunnerTerminal(runner)
        );
      }

      case "linux": {
        return await createSimulatorExecutionLinux(this.config, {
          openGame,
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
