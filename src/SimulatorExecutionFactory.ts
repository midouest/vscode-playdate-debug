import * as vscode from "vscode";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { CustomExecutionFactory } from "./CustomExecutionFactory";
import { SimulatorTaskRunner } from "./SimulatorTaskRunner";
import { TaskRunnerTerminal } from "./TaskRunnerTerminal";

/**
 * The SimulatorExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `playdate-simulator` task.
 */
export class SimulatorExecutionFactory implements CustomExecutionFactory {
  constructor(private config: ConfigurationResolver) {}

  createExecution(definition: vscode.TaskDefinition): vscode.CustomExecution {
    const { openGame } = definition;
    return new vscode.CustomExecution(async () => {
      const runner = new SimulatorTaskRunner(this.config, {
        openGame,
      });
      return new TaskRunnerTerminal(runner);
    });
  }
}
