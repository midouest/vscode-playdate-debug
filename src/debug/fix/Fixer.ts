import { DebugProtocolMessage } from "vscode";

import { Fix, isClientFix, isServerFix } from "./Fix";
import { OnProxyClient } from "./OnProxyClient";
import { OnProxyServer } from "./OnProxyServer";

export class Fixer implements OnProxyClient, OnProxyServer {
  private clientFixes: OnProxyClient[] = [];
  private serverFixes: OnProxyServer[] = [];

  constructor(fixes: Fix[]) {
    for (const fix of fixes) {
      if (isClientFix(fix)) {
        this.clientFixes.push(fix);
      }

      if (isServerFix(fix)) {
        this.serverFixes.push(fix);
      }
    }
  }

  onProxyClient(message: any): DebugProtocolMessage | null {
    for (const fixer of this.clientFixes) {
      const response = fixer.onProxyClient(message);
      if (response !== null) {
        return response;
      }
    }
    return null;
  }

  onProxyServer(message: any): void {
    for (const fixer of this.serverFixes) {
      fixer.onProxyServer(message);
    }
  }
}
