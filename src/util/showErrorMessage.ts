import * as vscode from "vscode";

export function showErrorMessage(err: unknown): void {
  if (err instanceof Error) {
    vscode.window.showErrorMessage(err.message);
  }
}
