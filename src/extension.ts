import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const provider = new PlaydateConfigurationProvider();
  context.subscriptions.push(
    vscode.debug.registerDebugConfigurationProvider("playdate", provider)
  );

  const factory = new PlaydateDebugAdapterServerDescriptorFactory();
  context.subscriptions.push(
    vscode.debug.registerDebugAdapterDescriptorFactory("playdate", factory)
  );
}

export function deactivate() {
  // noop
}

class PlaydateDebugAdapterServerDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory
{
  createDebugAdapterDescriptor(
    _session: vscode.DebugSession,
    _executable: vscode.DebugAdapterExecutable | undefined
  ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    return new vscode.DebugAdapterServer(55934);
  }
}

class PlaydateConfigurationProvider
  implements vscode.DebugConfigurationProvider
{
  resolveDebugConfiguration(
    _folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration,
    _token?: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.DebugConfiguration> {
    const { type, request, name, sdkPath, sourcePath, gamePath } = config;
    return {
      type,
      request,
      name,
      sdkPath,
      sourcePath,
      gamePath,
    };
  }
}
