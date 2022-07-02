import * as vscode from "vscode";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { FixerFactory } from "./FixerFactory";
import { PDCExecutionFactory } from "./PDCExecutionFactory";
import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { ProxyDebugAdapterDescriptorFactory } from "./ProxyDebugAdapterDescriptorFactory";
import { SimulatorExecutionFactory } from "./SimulatorExecutionFactory";
import { TaskProvider } from "./TaskProvider";
import {
  PDC_EXTERNAL_PROBLEM_MATCHER,
  PDC_LUA_PROBLEM_MATCHER,
  PDC_TASK_TYPE,
  PLAYDATE_DEBUG_TYPE,
  SIMULATOR_TASK_TYPE,
  TASK_SOURCE,
} from "./constants";

/**
 * activate is called when VS Code activates this extension. The
 * `activationEvents` property in the project's package.json specifies the
 * events that cause the extension to be activated.
 */
export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    return;
  }

  const config = new ConfigurationResolver(workspaceRoot);

  registerDebugger(context, config);
  registerPDCTask(context, config);
  registerSimulatorTask(context, config);
}

/**
 * deactivate is called by VS Code when the extension is being disabled.
 */
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

function registerDebugger(
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

  const fixerFactory = new FixerFactory();

  const descriptorFactory = new ProxyDebugAdapterDescriptorFactory(
    fixerFactory
  );
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
  const pdcTaskProvider = new TaskProvider(pdcFactory, {
    type: PDC_TASK_TYPE,
    problemMatchers: [PDC_LUA_PROBLEM_MATCHER, PDC_EXTERNAL_PROBLEM_MATCHER],
    name: "Build",
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
  const simulatorTaskProvider = new TaskProvider(simulatorFactory, {
    type: SIMULATOR_TASK_TYPE,
    problemMatchers: [PDC_EXTERNAL_PROBLEM_MATCHER],
    name: "Simulator",
    source: TASK_SOURCE,
  });
  context.subscriptions.push(
    vscode.tasks.registerTaskProvider(
      SIMULATOR_TASK_TYPE,
      simulatorTaskProvider
    )
  );
}
