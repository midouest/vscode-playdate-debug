import * as vscode from "vscode";

export async function runTask(task: vscode.Task): Promise<void> {
  const execution = await vscode.tasks.executeTask(task);

  return new Promise((resolve) => {
    vscode.tasks.onDidEndTask((event) => {
      if (event.execution === execution) {
        resolve();
      }
    });
  });
}
