import * as net from "net";

import { SIMULATOR_DEBUG_PORT } from "./constants";
import { waitForDebugPort } from "./waitForDebugPort";

/**
 * ProxyServer is used to improve the experience of debugging Playdate games
 * in VS Code. It works around some issues caused by bugs in the Playdate
 * Simulator debug adapter protocol server and limitations in VS Code.
 *
 * See https://microsoft.github.io/debug-adapter-protocol/ for details about
 * the Debug Adapter Protocol.
 */
export class ProxyServer {
  private clientSocket!: net.Socket;
  private simulatorSocket!: net.Socket;
  private simulatorSeq!: number;
  private simulatorSeqOffset = 0;

  /**
   * Connect to the Playdate Simulator debugger and then start the proxy server.
   *
   * @returns The proxy socket server instance. Calling code must call `listen`
   * on the socket server to accept incoming connections from VS Code.
   */
  static async start(): Promise<net.Server> {
    const proxy = new ProxyServer();
    await proxy.connect();

    return net.createServer((socket) => {
      if (proxy.clientSocket) {
        return;
      }

      proxy.clientSocket = socket;
      proxy.clientSocket.on("data", (data) => proxy.proxyClientData(data));
    });
  }

  private async connect(): Promise<void> {
    // The Playdate Simulator's debug adapter protocol server takes ~250ms to
    // respond on the debug port after launching the app. waitForDebugPort will
    // attempt to continuously connect to the Playdate Simulator up to a certain
    // number of times with a short timeout. We return the connected socket
    // because closing it immediately after a successful connection can cause
    // the Playdate Simulator to become unresponsive to new connections.
    const socket = await waitForDebugPort(SIMULATOR_DEBUG_PORT);
    if (!socket) {
      throw new Error(`Could not connect to Playdate Simulator`);
    }

    this.simulatorSocket = socket;
    this.simulatorSocket.on("data", (data) => this.proxySimulatorData(data));
    this.simulatorSocket.on("close", () => this.clientSocket?.end());
  }

  private proxyClientData(dataIn: Buffer): void {
    const message = decodeMessage(dataIn);

    if (message.type === "request" && message.command === "launch") {
      // The Playdate Simulator never sends a success response to VS Code when
      // it receives a launch request. This causes VS Code to appear to hang
      // indefinitely. We immediately respond to the client with a success
      // response and increase the sequence count of all future messages by one.
      const response = {
        type: "response",
        command: "launch",
        success: true,
        seq: this.simulatorSeq + 1,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        request_seq: message.seq,
      };
      this.simulatorSeqOffset += 1;

      const dataOut = encodeMessage(response);
      this.clientSocket?.write(dataOut);
    }

    const dataOut = encodeMessage(message);
    this.simulatorSocket?.write(dataOut);
  }

  private proxySimulatorData(dataIn: Buffer): void {
    const message = decodeMessage(dataIn);
    this.simulatorSeq = message.seq;

    if (message.type === "response" && message.command === "initialize") {
      // The Playdate Simulator responds with "supportsTerminateRequest": true.
      // However, when VS Code attempts to send a terminate request, it responds
      // with "Unsupported method: terminate". Disabling the
      // "supportsTerminateRequest" capability causes VS Code to send a
      // disconnect request instead.
      message.body.supportsTerminateRequest = false;
    }

    // Offset messages from the simulator because we may have inserted a missing
    // response.
    message.seq += this.simulatorSeqOffset;

    const dataOut = encodeMessage(message);
    this.clientSocket?.write(dataOut);
  }
}

// See https://microsoft.github.io/debug-adapter-protocol/overview#base-protocol
// for a description of the base protocol used to transmit Debug Adapter
// Protocol messages.

function decodeMessage(data: Buffer): any {
  const payload = data.toString();
  const components = payload.split(SEPARATOR);
  const content = components[1];
  return JSON.parse(content);
}

function encodeMessage(message: any): Buffer {
  const content = JSON.stringify(message);
  const components = [`Content-Length: ${content.length}`, content];
  const payload = components.join(SEPARATOR);
  return Buffer.from(payload);
}

const SEPARATOR = "\r\n\r\n";
