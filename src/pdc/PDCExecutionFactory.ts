import { inject, injectable } from "inversify";
import * as vscode from "vscode";

import {
  ConfigurationResolver,
  TaskExecution,
  TaskExecutionFactory,
  TaskRunnerTerminal,
} from "../core";

import { PDCTaskRunner } from "./PDCTaskRunner";

/**
 * The PDCExecutionFactory is responsible for configuring the VS Code
 * pseudoterminal that executes the `pdc` task.
 */
@injectable()
export class PDCExecutionFactory implements TaskExecutionFactory {
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

    const { sdkPath, sourcePath, gamePath } = config;
    const { strip, noCompress, verbose, quiet, skipUnknown } = definition;

    const execution = new vscode.CustomExecution(async () => {
      const runner = new PDCTaskRunner({
        sdkPath,
        sourcePath,
        gamePath,
        strip,
        noCompress,
        verbose,
        quiet,
        skipUnknown,
      });
      return new TaskRunnerTerminal(runner);
    });
    return execution;
  }
}
