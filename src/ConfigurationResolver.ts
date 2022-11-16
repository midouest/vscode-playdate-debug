import * as path from "path";

import * as vscode from "vscode";

import { getPDXInfo } from "./getPDXInfo";
import { getSDKPath } from "./getSDKPath";
import { getSDKVersion } from "./getSDKVersion";
import { toAbsolute } from "./toAbsolute";

export interface Configuration {
  sdkPath: string;
  sdkVersion: string;
  sourcePath: string;
  outputPath: string;
  productName: string;
  productPath: string;
  gamePath: string;
}

/**
 * ConfigurationResolver is responsible for resolving the final PlaydateSDK and
 * game configuration. It resolves configuration from the VS Code workspace
 * configuration and the user's environment.
 */
export class ConfigurationResolver {
  constructor(private workspaceRoot: string) {}

  async resolve(): Promise<Configuration> {
    let { sdkPath, sourcePath, outputPath, productName } =
      vscode.workspace.getConfiguration("playdate-debug");

    if (!sdkPath) {
      sdkPath = await getSDKPath();
    } else {
      sdkPath = this.toAbsolute(sdkPath);
    }

    const sdkVersion = await getSDKVersion(sdkPath);

    if (!sourcePath) {
      sourcePath = path.resolve(this.workspaceRoot, "source");
    }
    sourcePath = this.toAbsolute(sourcePath);

    if (!outputPath) {
      outputPath = this.workspaceRoot;
    }
    outputPath = this.toAbsolute(outputPath);

    if (!productName) {
      const pdxInfo = await getPDXInfo(sourcePath);
      productName = pdxInfo.name;
    }

    const productPath = path.resolve(outputPath, productName);
    const gamePath = productPath + ".pdx";

    return {
      sdkPath,
      sdkVersion,
      sourcePath,
      outputPath,
      productName,
      productPath,
      gamePath,
    };
  }

  private toAbsolute(
    relativePath: string | undefined | null
  ): string | undefined | null {
    if (relativePath == null) {
      return relativePath;
    }
    return toAbsolute(this.workspaceRoot, relativePath);
  }
}
