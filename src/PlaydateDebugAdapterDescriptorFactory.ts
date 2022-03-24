import * as vscode from "vscode";

import { SIMULATOR_DEBUG_PORT } from "./constants";

export class PlaydateDebugAdapterDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory
{
  createDebugAdapterDescriptor(): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
    return new vscode.DebugAdapterServer(SIMULATOR_DEBUG_PORT);
  }
}
