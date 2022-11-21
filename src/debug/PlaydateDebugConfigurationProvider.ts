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
    if (config.gamePath && config.sourcePath) {
      const workspaceConfig = await this.config.resolveWithoutPDXInfo(folder);
      if (!workspaceConfig) {
        return undefined;
      }

      const { sdkPath } = workspaceConfig;
      return { ...config, sdkPath };
    }

    const workspaceConfig = await this.config.resolve(folder);
    if (!workspaceConfig) {
      return undefined;
    }

    const { sdkPath, sourcePath, gamePath } = workspaceConfig;

    return {
      ...config,
      sdkPath,
      sourcePath,
      gamePath,
    };
  }
}
