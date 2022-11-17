import * as vscode from "vscode";

export class DebugAdapterLogger {
  private formatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: "medium",
  });

  constructor(private output?: vscode.OutputChannel) {}

  log(message: any, sender: "server" | "client"): void {
    if (!this.output) {
      return;
    }

    const now = this.formatter.format(new Date());
    const header = `${sender.toUpperCase()} ${now}`;
    const logMessage = `${header}\n${message}\n`;
    this.output.appendLine(logMessage);
  }
}
