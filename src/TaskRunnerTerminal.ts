import * as vscode from "vscode";

import { TaskRunner } from "./TaskRunner";

export class TaskRunnerTerminal implements vscode.Pseudoterminal {
  private writeEmitter = new vscode.EventEmitter<string>();
  onDidWrite: vscode.Event<string> = this.writeEmitter.event;

  private closeEmitter = new vscode.EventEmitter<number>();
  onDidClose?: vscode.Event<number> = this.closeEmitter.event;

  constructor(private runner: TaskRunner) {}

  open(): void {
    this.run();
  }

  close(): void {
    // noop
  }

  private async run(): Promise<void> {
    const errorMessage = await this.runner.run();
    let status = 0;
    if (errorMessage) {
      this.writeEmitter.fire(errorMessage + "\n");
      status = 1;
    }
    this.closeEmitter.fire(status);
  }
}
