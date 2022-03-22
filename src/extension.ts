import * as vscode from "vscode";

import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { PlaydateDebugAdapterDescriptorFactory } from "./PlaydateDebugAdapterDescriptorFactory";
import { ConfigurationResolver } from "./ConfigurationResolver";
import { PDCExecutionFactory } from "./PDCExecutionFactory";
import { SimulatorExecutionFactory } from "./SimulatorExecutionFactory";
import { CustomTaskProvider } from "./CustomTaskProvider";
import {
  PDC_TASK_NAME,
  PDC_TASK_TYPE,
  PLAYDATE_DEBUG_TYPE,
  SIMULATOR_TASK_NAME,
  SIMULATOR_TASK_TYPE,
  TASK_SOURCE,
} from "./constants";

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    return;
  }

  const config = new ConfigurationResolver(workspaceRoot);

  registerDebuger(context, config);
  registerPDCTask(context, config);
  registerSimulatorTask(context, config);
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

function registerDebuger(
  context: vscode.ExtensionContext,
  config: ConfigurationResolver
): void {
  const configProvider = new PlaydateDebugConfigurationProvider(config);
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider(
      PLAYDATE_DEBUG_TYPE,
      configProvider
    )
  );

  const descriptorFactory = new PlaydateDebugAdapterDescriptorFactory();
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory(
      PLAYDATE_DEBUG_TYPE,
      descriptorFactory
    )
  );
}

function registerPDCTask(
  context: vscode.ExtensionContext,
  config: ConfigurationResolver
): void {
  const pdcFactory = new PDCExecutionFactory(config);
  const pdcTaskProvider = new CustomTaskProvider(pdcFactory, {
    type: PDC_TASK_TYPE,
    problemMatchers: ["$pdc-lua", "$pdc-external"],
    name: PDC_TASK_NAME,
    source: TASK_SOURCE,
  });
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider(PDC_TASK_TYPE, pdcTaskProvider)
  );
}

function registerSimulatorTask(
  context: vscode.ExtensionContext,
  config: ConfigurationResolver
): void {
  const simulatorFactory = new SimulatorExecutionFactory(config);
  const simulatorTaskProvider = new CustomTaskProvider(simulatorFactory, {
    type: SIMULATOR_TASK_TYPE,
    problemMatchers: ["$pdc-external"],
    name: SIMULATOR_TASK_NAME,
    source: TASK_SOURCE,
  });
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider(
      SIMULATOR_TASK_TYPE,
      simulatorTaskProvider
    )
  );
}
