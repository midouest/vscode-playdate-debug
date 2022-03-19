import * as vscode from "vscode";

import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { PlaydateDebugAdapterDescriptorFactory } from "./PlaydateDebugAdapterDescriptorFactory";
import { PDCTaskProvider } from "./PDCTaskProvider";

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    return;
  }

  const configProvider = new PlaydateDebugConfigurationProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider("playdate", configProvider)
  );

  const descriptorFactory = new PlaydateDebugAdapterDescriptorFactory();
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(
      "playdate",
      descriptorFactory
    )
  );

  const taskProvider = new PDCTaskProvider(workspaceRoot);
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider(PDCTaskProvider.taskType, taskProvider)
  );
}

export function deactivate() {
  // noop
}

function getWorkspaceRoot(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    return undefined;
  }

  return folders[0].uri.fsPath;
}
