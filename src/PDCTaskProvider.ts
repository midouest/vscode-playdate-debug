import * as vscode from "vscode";

import { PDCTaskTerminal } from "./PDCTaskTerminal";

export class PDCTaskProvider implements vscode.TaskProvider {
  static taskType = "pdc";

  private pdcPromise: Thenable<vscode.Task[]> | undefined = undefined;

  constructor(private workspaceRoot: string) {}

  public provideTasks(
    _token: vscode.CancellationToken
  ): Thenable<vscode.Task[]> | undefined {
    if (!this.pdcPromise) {
      const task = createPDCTask(this.workspaceRoot);
      this.pdcPromise = Promise.resolve([task]);
    }
    return this.pdcPromise;
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
    async (_task) =>
      new PDCTaskTerminal({
        workspaceRoot,
        sdkPath: definition.sdkPath,
        sourcePath: definition.sourcePath,
        outputPath: definition.outputPath,
      })
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
