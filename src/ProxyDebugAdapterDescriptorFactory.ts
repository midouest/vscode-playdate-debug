import * as net from "net";

import * as vscode from "vscode";

import { FixerFactory } from "./FixerFactory";
import { ProxyServer } from "./ProxyServer";

/**
 * ProxyDebugAdapterDescriptorFactory launches the Playdate debugger proxy
 * server and tells VS Code how to connect to it.
 */
export class ProxyDebugAdapterDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory, vscode.Disposable
{
  private server: net.Server | undefined;

  constructor(private fixerFactory: FixerFactory) {}

  async createDebugAdapterDescriptor(): Promise<vscode.DebugAdapterDescriptor> {
    this.server?.close();

    const fixer = await this.fixerFactory.buildFixer();
    this.server = await ProxyServer.start(fixer);
    this.server.listen(0);

    const address = this.server.address() as net.AddressInfo;
    const port = address.port;
    return new vscode.DebugAdapterServer(port);
  }

  dispose(): void {
    this.server?.close();
  }
}
