import * as vscode from "vscode";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { PDCTaskRunner } from "./PDCTaskRunner";
import { TaskExecutionFactory } from "./TaskExecutionFactory";
import { TaskRunnerTerminal } from "./TaskRunnerTerminal";

/**
 * The PDCExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `pdc` task.
 */
export class PDCExecutionFactory implements TaskExecutionFactory {
  constructor(private config: ConfigurationResolver) {}

  createExecution(definition: vscode.TaskDefinition): vscode.CustomExecution {
    const { timeout } = definition;
    return new vscode.CustomExecution(async () => {
      const runner = new PDCTaskRunner(this.config, { timeout });
      return new TaskRunnerTerminal(runner);
    });
  }
}
