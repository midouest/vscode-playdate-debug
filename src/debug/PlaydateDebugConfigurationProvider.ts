import * as path from "path";

import { inject, injectable } from "inversify";
import * as vscode from "vscode";

import { ConfigurationResolver } from "../core";

/**
 * PlaydateDebugConfigurationProvider injects the configuration necessary to
 * debug a Playdate game into the launch configuration for the playdate
 * debugger.
 */
@injectable()
export class PlaydateDebugConfigurationProvider
  implements vscode.DebugConfigurationProvider
{
  constructor(
    @inject(ConfigurationResolver)
    private config: ConfigurationResolver
  ) {}

  async resolveDebugConfiguration(
    folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration
  ): Promise<vscode.DebugConfiguration | undefined | null> {
    const workspaceConfig = await this.config.resolve(folder);
    if (!workspaceConfig) {
      return undefined;
    }

    const {
      sdkPath,
      sourcePath: sourcePathConfig,
      gamePath: gamePathConfig,
    } = workspaceConfig;

    let sourcePath = sourcePathConfig;
    let gamePath = gamePathConfig;
    if (config.sourcePath?.endsWith(".lua") && config.gamePath) {
      sourcePath = path.dirname(config.sourcePath);
      gamePath = config.gamePath;
    }

    return {
      ...config,
      sdkPath,
      sourcePath,
      gamePath,
    };
  }
}
