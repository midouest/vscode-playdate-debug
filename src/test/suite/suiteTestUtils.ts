import * as path from "path";

import * as vscode from "vscode";

import { getWorkspaceFixturesPath } from "../testUtils";

export function getFixtureWorkspaceFolder(
  fixture: string
): vscode.WorkspaceFolder | undefined {
  const fixturesPath = getWorkspaceFixturesPath();
  const fixturePath = path.resolve(fixturesPath, fixture);
  const uri = vscode.Uri.file(fixturePath);
  return vscode.workspace.getWorkspaceFolder(uri);
}
