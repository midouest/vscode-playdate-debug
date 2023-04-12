import * as vscode from "vscode";

import { DebugAdapterLogger } from "./DebugAdapterLogger";

export class DebugAdapterLoggerFactory implements vscode.Disposable {
  private output = vscode.window.createOutputChannel("Playdate Debug", "json");

  createLogger(enabled: boolean): DebugAdapterLogger | null {
    if (!enabled) {
      return null;
    }

    return new DebugAdapterLogger(this.output);
  }

  dispose() {
    this.output.dispose();
  }
}
