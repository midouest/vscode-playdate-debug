import * as vscode from "vscode";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { PDCTaskRunner } from "./PDCTaskRunner";
import { TaskExecution, TaskExecutionFactory } from "./TaskExecutionFactory";
import { TaskRunnerTerminal } from "./TaskRunnerTerminal";

/**
 * The PDCExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `pdc` task.
 */
export class PDCExecutionFactory implements TaskExecutionFactory {
  constructor(private config: ConfigurationResolver) {}

  createExecution(definition: vscode.TaskDefinition): Promise<TaskExecution> {
    const { strip, noCompress, verbose, quiet, skipUnknown } = definition;
    const execution = new vscode.CustomExecution(async () => {
      const runner = new PDCTaskRunner(this.config, {
        strip,
        noCompress,
        verbose,
        quiet,
        skipUnknown,
      });
      return new TaskRunnerTerminal(runner);
    });
    return Promise.resolve(execution);
  }
}
