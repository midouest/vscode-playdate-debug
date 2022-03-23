import * as vscode from "vscode";
import { PROXY_DEBUG_PORT } from "./constants";

export class PlaydateDebugAdapterDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory
{
  createDebugAdapterDescriptor(
    _session: vscode.DebugSession,
    _executable: vscode.DebugAdapterExecutable | undefined
  ): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    return new vscode.DebugAdapterServer(PROXY_DEBUG_PORT);
  }
}
