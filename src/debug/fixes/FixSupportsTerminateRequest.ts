import { OnProxyServer } from "ext/core";

/**
 * The Playdate Simulator responds with "supportsTerminateRequest": true.
 * However, when VS Code attempts to send a terminate request, it responds
 * with "Unsupported method: terminate". Disabling the
 * "supportsTerminateRequest" capability causes VS Code to send a
 * disconnect request instead.
 */
export class FixSupportsTerminateRequest implements OnProxyServer {
  onProxyServer(message: any): void {
    if (message.type !== "response" || message.command !== "initialize") {
      return;
    }

    message.body.supportsTerminateRequest = false;
  }
}
