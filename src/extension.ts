import "reflect-metadata";
import * as vscode from "vscode";

import { ExtensionModule } from "./ExtensionModule";
import { CoreModule } from "./core";
import { DebugModule } from "./debug";
import { PDCModule } from "./pdc";
import { SimulatorModule } from "./simulator";

/**
 * activate is called when VS Code activates this extension. The
 * `activationEvents` property in the project's package.json specifies the
 * events that cause the extension to be activated.
 */
export function activate(context: vscode.ExtensionContext) {
  ExtensionModule.activate(context, [
    CoreModule,
    DebugModule,
    PDCModule,
    SimulatorModule,
  ]);
}

/**
 * deactivate is called by VS Code when the extension is being disabled.
 */
export function deactivate() {
  // noop
}
