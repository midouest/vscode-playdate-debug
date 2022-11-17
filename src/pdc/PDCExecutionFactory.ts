import { inject, injectable } from "inversify";
import * as vscode from "vscode";

import {
  ConfigurationResolver,
  TaskExecution,
  TaskExecutionFactory,
  TaskRunnerTerminal,
} from "ext/core";

import { PDCTaskRunner } from "./PDCTaskRunner";

/**
 * The PDCExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `pdc` task.
 */
@injectable()
export class PDCExecutionFactory implements TaskExecutionFactory {
  constructor(
    @inject(ConfigurationResolver) private config: ConfigurationResolver
  ) {}

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
