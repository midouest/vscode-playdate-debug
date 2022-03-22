import * as vscode from "vscode";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { ExecutionFactory } from "./ExecutionFactory";
import { PDCTaskRunner } from "./PDCTaskRunner";
import { TaskRunnerTerminal } from "./TaskRunnerTerminal";

export class PDCExecutionFactory implements ExecutionFactory {
  constructor(private config: ConfigurationResolver) {}

  createExecution(definition: vscode.TaskDefinition): vscode.CustomExecution {
    const { timeout } = definition;
    return new vscode.CustomExecution(async (_task) => {
      const runner = new PDCTaskRunner(this.config, { timeout });
      return new TaskRunnerTerminal(runner);
    });
  }
}
