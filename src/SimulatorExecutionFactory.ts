import * as vscode from "vscode";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { SimulatorTaskRunner } from "./SimulatorTaskRunner";
import { TaskExecutionFactory } from "./TaskExecutionFactory";
import { TaskRunnerTerminal } from "./TaskRunnerTerminal";

/**
 * The SimulatorExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `playdate-simulator` task.
 */
export class SimulatorExecutionFactory implements TaskExecutionFactory {
  constructor(private config: ConfigurationResolver) {}

  createExecution(definition: vscode.TaskDefinition): vscode.CustomExecution {
    const { openGame, kill } = definition;
    return new vscode.CustomExecution(async () => {
      const runner = new SimulatorTaskRunner(this.config, {
        openGame,
        kill,
      });
      return new TaskRunnerTerminal(runner);
    });
  }
}
