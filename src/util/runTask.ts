import * as vscode from "vscode";

export async function runTask(task: vscode.Task): Promise<void> {
  const execution = await vscode.tasks.executeTask(task);

  return new Promise((resolve, reject) => {
    const disposable = vscode.tasks.onDidEndTaskProcess((event) => {
      const { execution: eventExecution, exitCode } = event;
      if (eventExecution !== execution) {
        return;
      }

      if (exitCode) {
        reject(exitCode);
      } else {
        resolve();
      }

      disposable.dispose();
    });
  });
}
