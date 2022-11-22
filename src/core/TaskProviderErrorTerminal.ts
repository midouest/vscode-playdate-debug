import * as vscode from "vscode";

/*
 * TaskProviderErrorTerminal is used to log configuration-time errors from a
 * TaskProvider when the task is executed.
 */
export class TaskProviderErrorTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  onDidWrite: vscode.Event<string> = this.writeEmitter.event;

  private closeEmitter = new vscode.EventEmitter<number>();
  onDidClose?: vscode.Event<number> = this.closeEmitter.event;

  constructor(private error: unknown) {}

  open(): void {
    if (this.error instanceof Error) {
      const message = `Task configuration failed: ${this.error.message}`;
      this.writeEmitter.fire(message);
    }
    this.closeEmitter.fire(1);
  }

  close(): void {
    // noop
  }
}
