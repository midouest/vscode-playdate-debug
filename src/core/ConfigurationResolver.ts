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

/**
 * ConfigurationResolver is responsible for resolving the final PlaydateSDK and
 * game configuration. It resolves configuration from the VS Code workspace
 * configuration and the user's environment.
 */
@injectable()
export class ConfigurationResolver {
  async resolve(
    scope: vscode.WorkspaceFolder | vscode.TaskScope | undefined
  ): Promise<Configuration | undefined> {
    const workspaceFolder = getWorkspaceRoot(scope);
    if (!workspaceFolder) {
      return undefined;
    }
    const workspaceRoot = workspaceFolder.uri.fsPath;

    let { sdkPath, sourcePath, outputPath, productName } =
      vscode.workspace.getConfiguration("playdate-debug", workspaceFolder);

    if (!sdkPath) {
      sdkPath = await getSDKPath();
    } else {
      sdkPath = toAbsolute(workspaceRoot, sdkPath);
    }

    const sdkVersion = await getSDKVersion(sdkPath);

    if (!sourcePath) {
      sourcePath = path.resolve(workspaceRoot, "source");
    }
    sourcePath = toAbsolute(workspaceRoot, sourcePath);

    if (!outputPath) {
      outputPath = workspaceRoot;
    }
    outputPath = toAbsolute(workspaceRoot, outputPath);

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
}
