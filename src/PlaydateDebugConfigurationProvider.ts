import * as path from "path";

import * as vscode from "vscode";
import { PLAYDATE_DEBUG_SECTION } from "./constants";

import { getPDXInfo } from "./getPDXInfo";
import { getSDKPath } from "./getSDKPath";
import { getSourcePath } from "./getSourcePath";

export class PlaydateDebugConfigurationProvider
  implements vscode.DebugConfigurationProvider
{
  async resolveDebugConfiguration(
    folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration,
    _token?: vscode.CancellationToken
  ): Promise<vscode.DebugConfiguration | undefined | null> {
    const workspaceRoot = folder?.uri.fsPath;
    if (!workspaceRoot) {
      // Folder-less setups are not supported
      return null;
    }
    let { sdkPath, sourcePath, outputPath, productName } =
      vscode.workspace.getConfiguration(PLAYDATE_DEBUG_SECTION);
    if (!sdkPath) {
      sdkPath = await getSDKPath();
    }

    if (!outputPath) {
      outputPath = workspaceRoot;
    }

    if (!sourcePath) {
      sourcePath = await getSourcePath(workspaceRoot);
    }

    if (!productName) {
      const pdxInfo = await getPDXInfo(sourcePath);
      productName = pdxInfo.name;
    }

    const gamePath = path.resolve(outputPath, productName + ".pdx");

    return {
      ...config,
      sdkPath,
      sourcePath,
      gamePath,
    };
  }
}
