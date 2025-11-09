import { ContainerModule } from "inversify";
import * as vscode from "vscode";

import { ActivateResult, ExtensionModule } from "../ExtensionModule";
import { Command } from "../constants";
import { showErrorMessage } from "../util";

import { DebugSessionRegistry } from "./DebugSessionRegistry";
import { EditorContentsCommand } from "./EditorContentsCommand";

type EditorContentsCommandHandler = (
  resource: vscode.Uri | undefined,
) => Promise<void>;

export class EditorModule extends ExtensionModule {
  protected get containerModule(): ContainerModule {
    return new ContainerModule((bind) => {
      bind(EditorContentsCommand).toSelf();
      bind(DebugSessionRegistry).toSelf().inSingletonScope();
    });
  }

  activate(): ActivateResult {
    const registry = this.container.resolve(DebugSessionRegistry);
    const disposables = registry.activate();

    const runEditorContentsDisposable = vscode.commands.registerCommand(
      Command.runEditorContents,
      this.createHandler(),
    );

    const debugEditorContentsDisposable = vscode.commands.registerCommand(
      Command.debugEditorContents,
      this.createHandler(true),
    );

    return [
      ...disposables,
      runEditorContentsDisposable,
      debugEditorContentsDisposable,
    ];
  }

  private createHandler(debug = false): EditorContentsCommandHandler {
    return async (file: vscode.Uri | undefined) => {
      const editorContentsCommand = this.container.resolve(
        EditorContentsCommand,
      );
      try {
        await editorContentsCommand.execute(file, debug);
      } catch (err) {
        showErrorMessage(err);
      }
    };
  }
}
