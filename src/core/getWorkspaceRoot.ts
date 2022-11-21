import * as vscode from "vscode";

export function getWorkspaceRoot(
  scope?: vscode.Uri | vscode.WorkspaceFolder | vscode.TaskScope
): vscode.WorkspaceFolder | undefined {
  if (scope instanceof vscode.Uri) {
    return vscode.workspace.getWorkspaceFolder(scope);
  }

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
