import { Container } from "inversify";
import "reflect-metadata";
import * as vscode from "vscode";

import { PDCTaskProvider } from "./PDCTaskProvider";
import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { ProxyDebugAdapterDescriptorFactory } from "./ProxyDebugAdapterDescriptorFactory";
import { SimulatorTaskProvider } from "./SimulatorTaskProvider";
import {
  PDC_TASK_TYPE,
  PLAYDATE_DEBUG_TYPE,
  SIMULATOR_TASK_TYPE,
} from "./constants";
import { containerModule } from "./containerModule";
import { symbols } from "./symbols";

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

  const container = new Container();
  container.bind(symbols.workspaceRoot).toConstantValue(workspaceRoot);
  container.load(containerModule);

  context.subscriptions.push(...registerDebugger(container));
  context.subscriptions.push(registerPDCTask(container));
  context.subscriptions.push(registerSimulatorTask(container));
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

function registerDebugger(container: Container): vscode.Disposable[] {
  const configProvider = container.resolve(PlaydateDebugConfigurationProvider);
  const configProviderDisposable =
    vscode.debug.registerDebugConfigurationProvider(
      PLAYDATE_DEBUG_TYPE,
      configProvider
    );

  const descriptorFactory = container.resolve(
    ProxyDebugAdapterDescriptorFactory
  );
  const descriptorFactoryDisposable =
    vscode.debug.registerDebugAdapterDescriptorFactory(
      PLAYDATE_DEBUG_TYPE,
      descriptorFactory
    );

  return [configProviderDisposable, descriptorFactoryDisposable];
}

function registerPDCTask(container: Container): vscode.Disposable {
  const pdcTaskProvider = container.resolve(PDCTaskProvider);
  return vscode.tasks.registerTaskProvider(PDC_TASK_TYPE, pdcTaskProvider);
}

function registerSimulatorTask(container: Container): vscode.Disposable {
  const simulatorTaskProvider = container.resolve(SimulatorTaskProvider);
  return vscode.tasks.registerTaskProvider(
    SIMULATOR_TASK_TYPE,
    simulatorTaskProvider
  );
}
