import * as path from "path";

import * as vscode from "vscode";

import { getPDXInfo } from "./getPDXInfo";
import { getSDKPath } from "./getSDKPath";

export interface Configuration {
  sdkPath: string;
  sourcePath: string;
  outputPath: string;
  productName: string;
  productPath: string;
  gamePath: string;
  logDebugAdapter: boolean;
}

/**
 * FallbackOptions allow the calling code to control whether or not the
 * ConfigurationResolver attempts to lookup an undefined configuration variable
 * in the user's environment.
 */
export type FallbackOptions = {
  sdkPath?: boolean;
};

/**
 * ConfigurationResolver is responsible for resolving the final PlaydateSDK and
 * game configuration. It resolves configuration from the VS Code workspace
 * configuration and the user's environment.
 */
export class ConfigurationResolver {
  constructor(private workspaceRoot: string) {}

  async resolve(fallbackOptions?: FallbackOptions): Promise<Configuration> {
    let { sdkPath, sourcePath, outputPath, productName, logDebugAdapter } =
      vscode.workspace.getConfiguration("playdate-debug");

    if (!sdkPath && fallbackOptions?.sdkPath !== false) {
      sdkPath = await getSDKPath();
    }

    if (!sourcePath) {
      sourcePath = path.resolve(this.workspaceRoot, "source");
    }

    if (!outputPath) {
      outputPath = this.workspaceRoot;
    }

    if (!productName) {
      const pdxInfo = await getPDXInfo(sourcePath);
      productName = pdxInfo.name;
    }

    const productPath = path.resolve(outputPath, productName);
    const gamePath = productPath + ".pdx";

    return {
      sdkPath,
      sourcePath,
      outputPath,
      productName,
      productPath,
      gamePath,
      logDebugAdapter,
    };
  }
}
