import * as vscode from "vscode";
import { PLAYDATE_SOURCE } from "./constants";

import { PDCTaskTerminal } from "./PDCTaskTerminal";

export class PDCTaskProvider implements vscode.TaskProvider {
  static readonly taskType = "pdc";

  constructor(private workspaceRoot: string) {}

  public provideTasks(
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Task[]> {
    const task = this.createPDCTask();
    return [task];
  }

  public resolveTask(task: vscode.Task): vscode.Task | undefined {
    return this.createPDCTask(task);
  }

  private createPDCTask(task?: vscode.Task): vscode.Task {
    const definition = task?.definition ?? {
      type: PDCTaskProvider.taskType,
    };
    const scope = task?.scope ?? vscode.TaskScope.Workspace;
    const execution = new vscode.CustomExecution(
      async (_task) =>
        new PDCTaskTerminal({
          workspaceRoot: this.workspaceRoot,
          timeout: definition.timeout,
        })
    );
    const problemMatchers = ["$pdc-lua", "$pdc-external"];
    return new vscode.Task(
      definition,
      scope,
      "Build",
      PLAYDATE_SOURCE,
      execution,
      problemMatchers
    );
  }
}
