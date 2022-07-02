import * as net from "net";

import * as vscode from "vscode";

import { FixLaunchResponse } from "./FixLaunchResponse";
import { FixSupportsTerminateRequest } from "./FixSupportsTerminateRequest";
import { FixVariablesReference } from "./FixVariablesReference";
import { ProxyServer } from "./ProxyServer";

/**
 * ProxyDebugAdapterDescriptorFactory launches the Playdate debugger proxy
 * server and tells VS Code how to connect to it.
 */
export class ProxyDebugAdapterDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory, vscode.Disposable
{
  private server: net.Server | undefined;

  async createDebugAdapterDescriptor(): Promise<vscode.DebugAdapterDescriptor> {
    this.server?.close();

    const fixers = [
      new FixLaunchResponse(),
      new FixSupportsTerminateRequest(),
      new FixVariablesReference(),
    ];

    this.server = await ProxyServer.start(fixers);
    this.server.listen(0);

    const address = this.server.address() as net.AddressInfo;
    const port = address.port;
    return new vscode.DebugAdapterServer(port);
  }

  dispose(): void {
    this.server?.close();
  }
}
