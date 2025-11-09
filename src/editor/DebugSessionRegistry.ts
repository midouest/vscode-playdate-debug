import { injectable } from "inversify";
import * as vscode from "vscode";

import { DebugType } from "../constants";

@injectable()
export class DebugSessionRegistry {
  private sessions = new Map<string, vscode.DebugSession>();

  activate(): vscode.Disposable[] {
    const startDisposable = vscode.debug.onDidStartDebugSession((session) =>
      this.handleStartSession(session),
    );

    const stopDisposable = vscode.debug.onDidTerminateDebugSession((session) =>
      this.handleTerminateSession(session),
    );

    return [startDisposable, stopDisposable];
  }

  async stopAll(): Promise<void> {
    const sessions = Array.from(this.sessions.values());
    const promises = sessions.map((session) =>
      vscode.debug.stopDebugging(session),
    );
    await Promise.all(promises);
  }

  private handleStartSession(session: vscode.DebugSession): void {
    if (session.type === DebugType.playdate) {
      this.sessions.set(session.id, session);
    }
  }

  private handleTerminateSession(session: vscode.DebugSession): void {
    this.sessions.delete(session.id);
  }
}
