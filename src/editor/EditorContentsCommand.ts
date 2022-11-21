import { inject, injectable } from "inversify";
import * as vscode from "vscode";

import {
  CROSS_PLATFORM_DEBUG_SDK_VERSION,
  DebugType,
  TaskType,
} from "../constants";
import { ConfigurationResolver, getGamePathFromSource } from "../core";
import { PDCTaskProvider } from "../pdc";
import { SimulatorTaskProvider } from "../simulator";
import { runTask } from "../util";

@injectable()
export class EditorContentsCommand {
  constructor(
    @inject(ConfigurationResolver) private config: ConfigurationResolver,
    @inject(PDCTaskProvider) private pdcTaskProvider: PDCTaskProvider,
    @inject(SimulatorTaskProvider)
    private simulatorTaskProvider: SimulatorTaskProvider
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

    const { sdkPath, sdkVersion, outputPath } = config;
    const gamePath = getGamePathFromSource(sourcePath, outputPath);

    const pdcTask = await this.pdcTaskProvider.createTask({
      type: TaskType.pdc,
      sdkPath,
      sourcePath,
      gamePath,
    });
    await runTask(pdcTask);

    const debugUnsupported =
      process.platform !== "darwin" &&
      sdkVersion < CROSS_PLATFORM_DEBUG_SDK_VERSION;

    const simulatorTask = await this.simulatorTaskProvider.createTask({
      type: TaskType.simulator,
      kill: debugUnsupported,
      openGame: debugUnsupported,
      sdkPath,
      gamePath,
    });
    await runTask(simulatorTask);

    if (debugUnsupported) {
      return;
    }

    const parentOptions = this.getParentOptions(debug);
    await vscode.debug.startDebugging(
      undefined,
      {
        type: DebugType.playdate,
        name: this.getName(debug),
        request: "launch",
        sourcePath,
        gamePath,
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
