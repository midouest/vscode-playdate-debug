import * as vscode from "vscode";

export interface OnProxyClient {
  /**
   * This method is used to generate messages to send to the client as if they
   * were received from the Playdate Simulator. If the return value is null,
   * then no message will be generated.
   *
   * The original message is always sent to the Playdate Simulator.
   */
  onProxyClient(message: any): vscode.DebugProtocolMessage | null;
}
