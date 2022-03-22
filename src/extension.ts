import * as vscode from "vscode";

import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { PlaydateDebugAdapterDescriptorFactory } from "./PlaydateDebugAdapterDescriptorFactory";
import { PDCTaskProvider } from "./PDCTaskProvider";
import { SimulatorTaskProvider } from "./SimulatorTaskProvider";
import { ConfigurationResolver } from "./ConfigurationResolver";
import { PDCExecutionFactory } from "./PDCExecutionFactory";
import { SimulatorExecutionFactory } from "./SimulatorExecutionFactory";

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    return;
  }

  const configResolver = new ConfigurationResolver(workspaceRoot);

  const configProvider = new PlaydateDebugConfigurationProvider(configResolver);
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

  const pdcFactory = new PDCExecutionFactory(configResolver);
  const pdcTaskProvider = new PDCTaskProvider(pdcFactory);
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider(PDCTaskProvider.taskType, pdcTaskProvider)
  );

  const simulatorFactory = new SimulatorExecutionFactory(configResolver);
  const simulatorTaskProvider = new SimulatorTaskProvider(simulatorFactory);
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider(
      SimulatorTaskProvider.taskType,
      simulatorTaskProvider
    )
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
