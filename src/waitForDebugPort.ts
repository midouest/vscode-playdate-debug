import * as net from "net";
import { wait } from "./wait";

export interface WaitForDebugPortOptions {
  connectTimeout: number;
  retryTimeout: number;
  maxRetries: number;
}

const DEFAULT_OPTIONS: WaitForDebugPortOptions = {
  connectTimeout: 1000,
  retryTimeout: 100,
  maxRetries: 5,
};

export async function waitForDebugPort(
  port: number,
  options: Partial<WaitForDebugPortOptions> = DEFAULT_OPTIONS
): Promise<net.Socket | undefined> {
  const { connectTimeout, retryTimeout, maxRetries } = {
    ...DEFAULT_OPTIONS,
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
