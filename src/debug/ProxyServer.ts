import * as net from "net";

import { SIMULATOR_DEBUG_PORT } from "../constants";
import { waitForDebugPort, WaitForDebugPortOptions } from "../util";

import { DebugAdapterLogger } from "./DebugAdapterLogger";
import { Fixer } from "./fix";

/**
 * ProxyServer is used to improve the experience of debugging Playdate games
 * in VS Code. It works around compatibility issues between the Playdate
 * Simulator debug adapter protocol server and the VSCode client.
 *
 * See https://microsoft.github.io/debug-adapter-protocol/ for details about
 * the Debug Adapter Protocol.
 */
export class ProxyServer {
  private clientSocket!: net.Socket;
  private simulatorSocket!: net.Socket;

  private constructor(
    private fixer: Fixer | null,
    private logger: DebugAdapterLogger | null
  ) {}

  /**
   * Connect to the Playdate Simulator debugger and then start the proxy server.
   *
   * @returns The proxy socket server instance. Calling code must call `listen`
   * on the socket server to accept incoming connections from VS Code.
   */
  static async start(
    fixer: Fixer | null,
    logger: DebugAdapterLogger | null,
    options: Partial<WaitForDebugPortOptions> = {}
  ): Promise<net.Server> {
    const proxy = new ProxyServer(fixer, logger);
    await proxy.connect(options);

    return net.createServer((socket) => {
      if (proxy.clientSocket) {
        return;
      }

      proxy.clientSocket = socket;
      proxy.clientSocket.on("data", (data) => proxy.proxyClientData(data));
    });
  }

  private async connect(
    options: Partial<WaitForDebugPortOptions> = {}
  ): Promise<void> {
    // The Playdate Simulator's debug adapter protocol server takes ~250ms to
    // respond on the debug port after launching the app. waitForDebugPort will
    // attempt to continuously connect to the Playdate Simulator up to a certain
    // number of times with a short timeout. We return the connected socket
    // because closing it immediately after a successful connection can cause
    // the Playdate Simulator to become unresponsive to new connections.
    const socket = await waitForDebugPort(SIMULATOR_DEBUG_PORT, options);
    if (!socket) {
      throw new Error(`Could not connect to Playdate Simulator`);
    }

    this.simulatorSocket = socket;
    this.simulatorSocket.on("data", (data) => this.proxySimulatorData(data));
    this.simulatorSocket.on("close", () => this.clientSocket?.end());
  }

  private proxyClientData(dataIn: Buffer): void {
    this.logger?.log(dataIn.toString(), "client");

    if (!this.fixer) {
      this.simulatorSocket?.write(dataIn);
      return;
    }

    const messages = decodeMessages(dataIn);
    for (const message of messages) {
      const response = this.fixer.onProxyClient(message);
      if (response) {
        const dataOut = encodeMessage(response);
        this.clientSocket?.write(dataOut);
      }

      const dataOut = encodeMessage(message);
      this.simulatorSocket?.write(dataOut);
    }
  }

  private proxySimulatorData(dataIn: Buffer): void {
    this.logger?.log(dataIn.toString(), "server");

    if (!this.fixer) {
      this.clientSocket?.write(dataIn);
      return;
    }

    const messages = decodeMessages(dataIn);
    for (const message of messages) {
      this.fixer.onProxyServer(message);

      const dataOut = encodeMessage(message);
      this.clientSocket?.write(dataOut);
    }
  }
}

// See https://microsoft.github.io/debug-adapter-protocol/overview#base-protocol
// for a description of the base protocol used to transmit Debug Adapter
// Protocol messages.

function decodeMessages(data: Buffer): any[] {
  let payload = data.toString();
  const messages = [];
  while (payload) {
    const prefixIndex = payload.indexOf(CONTENT_LENGTH_PREFIX);
    if (prefixIndex < 0) {
      throw new Error(
        "Failed to decode message: expected Content-Length prefix"
      );
    }

    const prefixEnd = prefixIndex + CONTENT_LENGTH_PREFIX.length;
    const separatorIndex = payload.indexOf(SEPARATOR);
    const contentLengthData = payload.slice(prefixEnd, separatorIndex);

    let contentLength: number;
    try {
      contentLength = parseInt(contentLengthData, 10);
    } catch (err) {
      throw new Error(
        "Failed to decode message: Content-Length data must be an integer"
      );
    }

    const separatorEnd = separatorIndex + SEPARATOR.length;
    const contentEnd = separatorEnd + contentLength;
    const message = payload.slice(separatorEnd, contentEnd);
    payload = payload.slice(contentEnd);

    try {
      messages.push(JSON.parse(message));
    } catch (err) {
      throw new Error(
        "Failed to decode message: content must be in JSON format"
      );
    }
  }
  return messages;
}

function encodeMessage(message: any): Buffer {
  const content = JSON.stringify(message);
  const components = [`${CONTENT_LENGTH_PREFIX}${content.length}`, content];
  const payload = components.join(SEPARATOR);
  return Buffer.from(payload);
}

const CONTENT_LENGTH_PREFIX = "Content-Length: ";
const SEPARATOR = "\r\n\r\n";
