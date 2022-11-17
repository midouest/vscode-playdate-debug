import * as vscode from "vscode";

import { DebugAdapterLogger } from "./DebugAdapterLogger";

export class DebugAdapterLoggerFactory implements vscode.Disposable {
  private output = vscode.window.createOutputChannel("Playdate Debug", "json");

  createLogger(enabled: boolean): DebugAdapterLogger {
    const output = enabled ? this.output : undefined;
    return new DebugAdapterLogger(output);
  }

  dispose() {
    this.output.dispose();
  }
}
