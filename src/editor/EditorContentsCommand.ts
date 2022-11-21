import { inject, injectable } from "inversify";
import * as vscode from "vscode";

import { DebugType } from "../constants";
import { ConfigurationResolver } from "../core";
import { createPDCCommand } from "../pdc";
import { createMacOSSimulatorCommand } from "../simulator";
import { exec } from "../util";

@injectable()
export class EditorContentsCommand {
  constructor(
    @inject(ConfigurationResolver) private config: ConfigurationResolver
  ) {}

  async execute(resource?: vscode.Uri, debug = false): Promise<void> {
    const targetResource = this.getTargetResource(resource);
    if (!targetResource) {
      return;
    }
    const sourcePath = targetResource.fsPath;

    const config = await this.config.resolve(targetResource);
    if (!config) {
      return;
    }

    const { sdkPath, outputPath } = config;

    const pdc = createPDCCommand({
      sdkPath,
      input: sourcePath,
      output: outputPath,
    });
    await exec(pdc);

    const simulator = createMacOSSimulatorCommand({
      sdkPath,
    });
    await exec(simulator);

    const parentOptions = this.getParentOptions(debug);
    await vscode.debug.startDebugging(
      undefined,
      {
        type: DebugType.playdate,
        name: this.getName(debug),
        request: "launch",
        sourcePath,
        outputPath,
      },
      parentOptions
    );
  }

  private getName(debug: boolean): string {
    return `${debug ? "Debug" : "Run"} Editor Contents`;
  }

  private getParentOptions(
    debug: boolean
  ): vscode.DebugSessionOptions | undefined {
    return debug ? undefined : { noDebug: true };
  }

  private getTargetResource(
    resource: vscode.Uri | undefined
  ): vscode.Uri | undefined {
    return !resource && vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.document.uri
      : resource;
  }
}
