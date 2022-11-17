import * as vscode from "vscode";

import { TaskRunner } from "./TaskRunner";

/**
 * TaskRunnerTerminal is a generic VS Code pseduoterminal that runs a task once
 * and displays its error output, if any.
 */
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
    let status = 0;

    try {
      await this.runner.run((message) => this.emit(message));
    } catch (err) {
      status = 1;
      if (err instanceof Error) {
        this.emit(err.message);
      }
    }
    this.closeEmitter.fire(status);
  }

  private emit(message: string): void {
    const lines = message.split("\n");
    for (const line of lines) {
      this.writeEmitter.fire(line + "\r\n");
    }
  }
}
