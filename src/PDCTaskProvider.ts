import * as vscode from "vscode";

import { PDCTaskTerminal } from "./PDCTaskTerminal";

export class PDCTaskProvider implements vscode.TaskProvider {
  static taskType = "pdc";

  private playdatePromise: Thenable<vscode.Task[]> | undefined = undefined;

  constructor(private workspaceRoot: string) {}

  public provideTasks(
    _token: vscode.CancellationToken
  ): Thenable<vscode.Task[]> | undefined {
    if (!this.playdatePromise) {
      this.playdatePromise = Promise.resolve([
        createPDCTask(this.workspaceRoot),
      ]);
    }
    return this.playdatePromise;
  }

  public resolveTask(task: vscode.Task): vscode.Task | undefined {
    return createPDCTask(this.workspaceRoot, task);
  }
}

function createPDCTask(workspaceRoot: string, task?: vscode.Task): vscode.Task {
  const definition = task?.definition ?? {
    type: PDCTaskProvider.taskType,
  };
  const scope = task?.scope ?? vscode.TaskScope.Workspace;
  const execution = new vscode.CustomExecution(
    async (_task) => new PDCTaskTerminal(workspaceRoot)
  );
  const problemMatchers = ["$pdc-lua", "$pdc-external"];
  return new vscode.Task(
    definition,
    scope,
    "build",
    "pdc",
    execution,
    problemMatchers
  );
}
