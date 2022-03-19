import * as net from "net";

export interface WaitForDebugPortOptions {
  connectTimeout: number;
  retryTimeout: number;
  maxRetries: number;
}

const DEFAULT_OPTIONS: WaitForDebugPortOptions = {
  connectTimeout: 1000,
  retryTimeout: 0,
  maxRetries: 5,
};

export async function waitForDebugPort(
  port: number,
  options: Partial<WaitForDebugPortOptions> = DEFAULT_OPTIONS
): Promise<void> {
  const { connectTimeout, retryTimeout, maxRetries } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  for (let i = 0; i < maxRetries; i++) {
    try {
      await tryConnect(port, connectTimeout);
      return;
    } catch (err) {
      await wait(retryTimeout);
    }
  }

  throw new Error(`error: could not connect to port ${port}`);
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function tryConnect(port: number, connectTimeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    const succeed = () => {
      socket.end();
      resolve();
    };

    const fail = () => {
      socket.end();
      reject();
    };

    socket.setTimeout(connectTimeout);
    socket.once("timeout", fail);
    socket.once("error", fail);
    socket.connect(port, succeed);
  });
}
