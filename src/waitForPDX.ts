import * as fs from "fs/promises";
import { wait } from "./wait";

export interface WaitForPDXOptions {
  retryTimeout: number;
  maxRetries: number;
}

const DEFAULT_OPTIONS: WaitForPDXOptions = {
  retryTimeout: 10,
  maxRetries: 5,
};

export async function waitForPDX(
  gamePath: string,
  options: Partial<WaitForPDXOptions> = DEFAULT_OPTIONS
): Promise<boolean> {
  const { retryTimeout, maxRetries } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  for (let i = 0; i < maxRetries; i++) {
    try {
      await fs.stat(gamePath);
      return true;
    } catch (err) {
      await wait(retryTimeout);
    }
  }

  return false;
}
