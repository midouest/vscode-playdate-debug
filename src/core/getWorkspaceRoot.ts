import * as vscode from "vscode";

export function getWorkspaceRoot(
  scope?: vscode.WorkspaceFolder | vscode.TaskScope
): vscode.WorkspaceFolder | undefined {
  if (typeof scope === "object") {
    return scope;
  }

  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    return undefined;
  }

  return folders[0];
}

export function isFolderless(): boolean {
  const workspaceRoot = getWorkspaceRoot();
  return !workspaceRoot;
}
