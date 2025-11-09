import * as path from "path";

import { inject, injectable } from "inversify";
import * as vscode from "vscode";

import { CROSS_PLATFORM_DEBUG_SDK_VERSION } from "../constants";
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
    private config: ConfigurationResolver,
  ) {}

  async resolveDebugConfiguration(
    folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration,
  ): Promise<vscode.DebugConfiguration | undefined | null> {
    const workspaceConfig = await this.config.resolve(folder);
    if (!workspaceConfig) {
      return undefined;
    }

    const {
      sdkPath,
      sourcePath: sourcePathConfig,
      gamePath: gamePathConfig,
      sdkVersion,
    } = workspaceConfig;

    if (
      process.platform !== "darwin" &&
      sdkVersion < CROSS_PLATFORM_DEBUG_SDK_VERSION
    ) {
      throw new Error(
        `The Playdate debugger is not supported on Playdate SDK version ${sdkVersion}.
         Please upgrade to Playdate SDK version ${CROSS_PLATFORM_DEBUG_SDK_VERSION}
         or later.`,
      );
    }

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
