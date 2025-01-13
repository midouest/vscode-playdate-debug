import * as path from "path";

import { injectable } from "inversify";
import * as vscode from "vscode";

import { toAbsolute } from "../util";

import { getWorkspaceRoot } from "./getWorkspaceRoot";
import { readPDXInfo } from "./readPDXInfo";
import { readSDKPath } from "./readSDKPath";
import { readSDKVersion } from "./readSDKVersion";

export interface Configuration {
  workspaceRoot: string;
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
      sdkPath = await readSDKPath();
    } else {
      sdkPath = toAbsolute(workspaceRoot, sdkPath);
    }

    const sdkVersion = await readSDKVersion(sdkPath);

    let sourcePath = sourcePathConfig;
    if (!sourcePath) {
      sourcePath = path.resolve(workspaceRoot, "source");
    }
    sourcePath = toAbsolute(workspaceRoot, sourcePath);

    let outputPath = outputPathConfig;
    if (!outputPath) {
      outputPath = workspaceRoot;
    } else if (
      typeof outputPath === "object" &&
      "sdkFolder" in outputPath &&
      outputPath.sdkFolder === "simulatorGames"
    ) {
      outputPath = path.resolve(sdkPath, "Disk/Games");
    }
    outputPath = toAbsolute(workspaceRoot, outputPath);

    let productName = productNameConfig;
    if (!productName) {
      try {
        const pdxInfo = await readPDXInfo(sourcePath);
        productName = pdxInfo.name;
      } catch (_err) {
        productName = path.basename(sourcePath);
      }
    }

    const productPath = path.resolve(outputPath, productName);
    const gamePath = productPath + ".pdx";

    return {
      workspaceRoot,
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
