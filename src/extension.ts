import * as vscode from "vscode";

import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { PlaydateDebugAdapterDescriptorFactory } from "./PlaydateDebugAdapterDescriptorFactory";

export function activate(context: vscode.ExtensionContext) {
  if (isFolderless()) {
    return;
  }

  const provider = new PlaydateDebugConfigurationProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider("playdate", provider)
  );

  const factory = new PlaydateDebugAdapterDescriptorFactory();
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory("playdate", factory)
  );
}

export function deactivate() {
  // noop
}

function isFolderless(): boolean {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    return true;
  }

  const root = folders[0].uri.fsPath;
  return !!root;
}
