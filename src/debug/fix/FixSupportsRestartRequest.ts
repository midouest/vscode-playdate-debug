import { OnProxyServer } from "./OnProxyServer";

export class FixSupportsRestartRequest implements OnProxyServer {
  onProxyServer(message: any): void {
    if (message.type !== "response" || message.command !== "initialize") {
      return;
    }

    message.body.supportsRestartRequest = false;
  }
}
