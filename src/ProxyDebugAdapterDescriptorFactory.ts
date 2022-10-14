import * as net from "net";

import * as vscode from "vscode";

import { DebugAdapterLoggerFactory } from "./DebugAdapterLoggerFactory";
import { FixerFactory } from "./FixerFactory";
import { ProxyServer } from "./ProxyServer";
import { WaitForDebugPortOptions } from "./waitForDebugPort";

/**
 * ProxyDebugAdapterDescriptorFactory launches the Playdate debugger proxy
 * server and tells VS Code how to connect to it.
 */
export class ProxyDebugAdapterDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory, vscode.Disposable
{
  private server?: net.Server;
  private loggerFactory = new DebugAdapterLoggerFactory();

  constructor(private fixerFactory: FixerFactory) {}

  async createDebugAdapterDescriptor(
    session: vscode.DebugSession
  ): Promise<vscode.DebugAdapterDescriptor> {
    this.server?.close();

    const { disableWorkarounds, logDebugAdapter, retryTimeout, maxRetries } =
      session.configuration;

    const options: Partial<WaitForDebugPortOptions> = {};
    if (retryTimeout !== undefined) {
      options.retryTimeout = retryTimeout;
    }
    if (maxRetries !== undefined) {
      options.maxRetries = maxRetries;
    }

    const fixer = await this.fixerFactory.buildFixer(disableWorkarounds);
    const logger = this.loggerFactory.createLogger(logDebugAdapter);

    this.server = await ProxyServer.start(fixer, logger, options);
    this.server.listen(0);

    const address = this.server.address() as net.AddressInfo;
    const port = address.port;
    return new vscode.DebugAdapterServer(port);
  }

  dispose(): void {
    this.server?.close();
    this.loggerFactory?.dispose();
  }
}
