import * as vscode from "vscode";

export function showErrorMessage(err: unknown): err is Error {
  if (err instanceof Error) {
    vscode.window.showErrorMessage(err.message);
    return true;
  }
  return false;
}
