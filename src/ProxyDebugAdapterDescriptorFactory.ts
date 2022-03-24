import * as net from "net";

import * as vscode from "vscode";

import { ProxyServer } from "./ProxyServer";

export class ProxyDebugAdapterDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory
{
  private server: net.Server | undefined;

  async createDebugAdapterDescriptor(): Promise<vscode.DebugAdapterDescriptor> {
    if (this.server) {
      this.server.close();
    }

    this.server = await ProxyServer.start();
    this.server.listen(0);

    const address = this.server.address() as net.AddressInfo;
    const port = address.port;
    return new vscode.DebugAdapterServer(port);
  }

  dispose(): void {
    this.server?.close();
  }
}
