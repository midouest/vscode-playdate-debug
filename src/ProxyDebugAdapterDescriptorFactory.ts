import * as net from "net";

import * as vscode from "vscode";

import { FixFactory } from "./FixFactory";
import { ProxyServer } from "./ProxyServer";

/**
 * ProxyDebugAdapterDescriptorFactory launches the Playdate debugger proxy
 * server and tells VS Code how to connect to it.
 */
export class ProxyDebugAdapterDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory, vscode.Disposable
{
  private server: net.Server | undefined;

  constructor(private fixFactory: FixFactory) {}

  async createDebugAdapterDescriptor(): Promise<vscode.DebugAdapterDescriptor> {
    this.server?.close();

    const fixes = await this.fixFactory.getFixes();
    this.server = await ProxyServer.start(fixes);
    this.server.listen(0);

    const address = this.server.address() as net.AddressInfo;
    const port = address.port;
    return new vscode.DebugAdapterServer(port);
  }

  dispose(): void {
    this.server?.close();
  }
}
