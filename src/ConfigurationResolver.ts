import * as path from "path";

import * as vscode from "vscode";

import { PLAYDATE_DEBUG_SECTION } from "./constants";
import { getPDXInfo } from "./getPDXInfo";
import { getSDKPath } from "./getSDKPath";
import { getSourcePath } from "./getSourcePath";

export interface Configuration {
  sdkPath: string;
  sourcePath: string;
  outputPath: string;
  productName: string;
  productPath: string;
  gamePath: string;
}

export type FallbackOptions = {
  sdkPath?: boolean;
};

export class ConfigurationResolver {
  constructor(private workspaceRoot: string) {}

  async resolve(fallbackOptions?: FallbackOptions): Promise<Configuration> {
    let { sdkPath, sourcePath, outputPath, productName } =
      vscode.workspace.getConfiguration(PLAYDATE_DEBUG_SECTION);

    if (!sdkPath && fallbackOptions?.sdkPath !== false) {
      sdkPath = await getSDKPath();
    }

    if (!sourcePath) {
      sourcePath = getSourcePath(this.workspaceRoot);
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
    };
  }
}
