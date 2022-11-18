import { OnProxyServer } from "./OnProxyServer";

export class FixBreakpointVerified implements OnProxyServer {
  onProxyServer(message: any): void {
    if (
      message.type !== "response" ||
      message.command !== "setBreakpoints" ||
      !message.success
    ) {
      return;
    }

    for (const breakpoint of message.body.breakpoints) {
      breakpoint.verified = true;
    }
  }
}
