import * as net from "net";

import { inject, injectable } from "inversify";
import * as vscode from "vscode";

import {
  CROSS_PLATFORM_DEBUG_SDK_VERSION,
  SIMULATOR_DEBUG_PORT,
} from "../constants";
import { ConfigurationResolver } from "../core";
import { WaitForDebugPortOptions } from "../util";

import { DebugAdapterLoggerFactory } from "./DebugAdapterLoggerFactory";
import { ProxyServer } from "./ProxyServer";
import { FixerFactory } from "./fix";

/**
 * ProxyDebugAdapterDescriptorFactory launches the Playdate debugger proxy
 * server and tells VS Code how to connect to it.
 */
@injectable()
export class ProxyDebugAdapterDescriptorFactory
  implements vscode.DebugAdapterDescriptorFactory, vscode.Disposable
{
  private server?: net.Server;
  private loggerFactory = new DebugAdapterLoggerFactory();

  constructor(
    @inject(ConfigurationResolver) private config: ConfigurationResolver,
    @inject(FixerFactory) private fixerFactory: FixerFactory
  ) {}

  async createDebugAdapterDescriptor(
    session: vscode.DebugSession
  ): Promise<vscode.DebugAdapterDescriptor | undefined> {
    this.server?.close();

    const { disableWorkarounds, logDebugAdapter, retryTimeout, maxRetries } =
      session.configuration;

    const config = await this.config.resolve(session.workspaceFolder);
    if (!config) {
      return undefined;
    }

    const { sdkVersion } = config;
    if (sdkVersion >= CROSS_PLATFORM_DEBUG_SDK_VERSION || disableWorkarounds) {
      return new vscode.DebugAdapterServer(SIMULATOR_DEBUG_PORT);
    }

    const options: Partial<WaitForDebugPortOptions> = {};
    if (retryTimeout !== undefined) {
      options.retryTimeout = retryTimeout;
    }
    if (maxRetries !== undefined) {
      options.maxRetries = maxRetries;
    }

    const fixer = await this.fixerFactory.buildFixer();
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
