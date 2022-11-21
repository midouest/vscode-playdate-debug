import * as path from "path";

import { injectable } from "inversify";
import * as vscode from "vscode";

import { toAbsolute } from "../util";

import { getPDXInfo } from "./getPDXInfo";
import { getSDKPath } from "./getSDKPath";
import { getSDKVersion } from "./getSDKVersion";
import { getWorkspaceRoot } from "./getWorkspaceRoot";

export interface Configuration {
  sdkPath: string;
  sdkVersion: string;
  sourcePath: string;
  outputPath: string;
  productName: string;
  productPath: string;
  gamePath: string;
}

export type ConfigurationScope =
  | vscode.Uri
  | vscode.WorkspaceFolder
  | vscode.TaskScope
  | undefined;

/**
 * ConfigurationResolver is responsible for resolving the final PlaydateSDK and
 * game configuration. It resolves configuration from the VS Code workspace
 * configuration and the user's environment.
 */
@injectable()
export class ConfigurationResolver {
  async resolve(scope: ConfigurationScope): Promise<Configuration | undefined> {
    const workspaceFolder = getWorkspaceRoot(scope);
    if (!workspaceFolder) {
      return undefined;
    }
    const workspaceRoot = workspaceFolder.uri.fsPath;

    const {
      sdkPath: sdkPathConfig,
      sourcePath: sourcePathConfig,
      outputPath: outputPathConfig,
      productName: productNameConfig,
    } = vscode.workspace.getConfiguration("playdate-debug", workspaceFolder);

    let sdkPath = sdkPathConfig;
    if (!sdkPath) {
      sdkPath = await getSDKPath();
    } else {
      sdkPath = toAbsolute(workspaceRoot, sdkPath);
    }

    const sdkVersion = await getSDKVersion(sdkPath);

    let sourcePath = sourcePathConfig;
    if (!sourcePath) {
      sourcePath = path.resolve(workspaceRoot, "source");
    }
    sourcePath = toAbsolute(workspaceRoot, sourcePath);

    let outputPath = outputPathConfig;
    if (!outputPath) {
      outputPath = workspaceRoot;
    }
    outputPath = toAbsolute(workspaceRoot, outputPath);

    let productName = productNameConfig;
    if (!productName) {
      try {
        const pdxInfo = await getPDXInfo(sourcePath);
        productName = pdxInfo.name;
      } catch (err) {
        // noop
      }
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
}
