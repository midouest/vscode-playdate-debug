import * as net from "net";

import { wait } from "./wait";

/**
 * WaitForDebugPortOptions is used to configure the timeouts and number of
 * retries performed by waitForDebugPort.
 */
export interface WaitForDebugPortOptions {
  /**
   * connectTimeout is the idle timeout in milliseconds set on the socket before
   * connecting. This won't have much of an effect in most cases because the
   * Simulator will usually respond immediately with a RST packet if the Debug
   * Adapter Protocol server is not ready.
   */
  connectTimeout: number;

  /**
   * retryTimeout is the timeout in milliseconds before the next connection
   * attempt after the previous attempt fails.
   */
  retryTimeout: number;

  /**
   * maxRetries is the maximum number of retries that can occur before
   * waitForDebugPort stops attempting to connect.
   */
  maxRetries: number;
}

const DEFAULT_DEBUG_PORT_OPTIONS: WaitForDebugPortOptions = {
  connectTimeout: 1000,
  retryTimeout: 200,
  maxRetries: 50,
};

/**
 * waitForDebugPort attempts to connect to the given port up to a maximum
 * number of retries with a brief timeout between retries.
 *
 * @param port The TCP port to connect to
 * @param options Configuration for timeouts and maximum number of retries
 * @returns The connected TCP socket if successful
 */
export async function waitForDebugPort(
  port: number,
  options: Partial<WaitForDebugPortOptions> = DEFAULT_DEBUG_PORT_OPTIONS
): Promise<net.Socket | undefined> {
  const { connectTimeout, retryTimeout, maxRetries } = {
    ...DEFAULT_DEBUG_PORT_OPTIONS,
    ...options,
  };

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await connect(port, connectTimeout);
    } catch (err) {
      await wait(retryTimeout);
    }
  }
}

function connect(port: number, timeout: number): Promise<net.Socket> {
  return new Promise((resolve, reject) => {
    const succeed = () => resolve(socket);
    const fail = () => socket.end(reject);
    const socket = net.createConnection({ port, timeout }, succeed);
    socket.once("error", fail);
  });
}
