import { DebugProtocolMessage } from "vscode";

import { OnProxyClient } from "./OnProxyClient";
import { OnProxyServer } from "./OnProxyServer";

export class FixLaunchResponse implements OnProxyClient, OnProxyServer {
  private simulatorSeq!: number;
  private simulatorSeqOffset = 0;

  onProxyClient(message: any): DebugProtocolMessage | null {
    if (message.type !== "request" || message.command !== "launch") {
      return null;
    }

    const response = {
      type: "response",
      command: "launch",
      success: true,
      seq: this.simulatorSeq + 1,
      request_seq: message.seq,
    };
    this.simulatorSeqOffset += 1;
    return response;
  }

  onProxyServer(message: any): void {
    this.simulatorSeq = message.seq;
    message.seq += this.simulatorSeqOffset;
  }
}
