import * as path from "path";

import * as vscode from "vscode";

import { PLAYDATE_DEBUG_SECTION } from "./constants";
import { getPDXInfo } from "./getPDXInfo";
import { getSDKPath } from "./getSDKPath";
import { getSourcePath } from "./getSourcePath";

export class ConfigurationResolver {
  private workspaceConfigurationMemo: vscode.WorkspaceConfiguration | undefined;
  private sdkPathMemo: string | undefined;
  private sourcePathMemo: string | undefined;
  private outputPathMemo: string | undefined;
  private productNameMemo: string | undefined;
  private productPathMemo: string | undefined;
  private gamePathMemo: string | undefined;

  constructor(private workspaceRoot: string) {}

  async getSDKPath(fallback = true): Promise<string | undefined> {
    if (this.sdkPathMemo) {
      return this.sdkPathMemo;
    }

    this.sdkPathMemo = this.getWorkspaceConfiguration().sdkPath;
    if (!this.sdkPathMemo && fallback) {
      this.sdkPathMemo = await getSDKPath();
    }

    return this.sdkPathMemo;
  }

  async getSourcePath(fallback = true): Promise<string | undefined> {
    if (this.sourcePathMemo) {
      return this.sourcePathMemo;
    }

    this.sourcePathMemo = this.getWorkspaceConfiguration().sourcePath;
    if (!this.sourcePathMemo && fallback) {
      this.sourcePathMemo = getSourcePath(this.workspaceRoot);
    }

    return this.sourcePathMemo;
  }

  async getOutputPath(fallback = true): Promise<string | undefined> {
    if (this.outputPathMemo) {
      return this.outputPathMemo;
    }

    this.outputPathMemo = this.getWorkspaceConfiguration().outputPath;
    if (!this.outputPathMemo && fallback) {
      this.outputPathMemo = this.workspaceRoot;
    }

    return this.outputPathMemo;
  }

  async getProductName(fallback = true): Promise<string | undefined> {
    if (this.productNameMemo) {
      return this.productNameMemo;
    }

    this.productNameMemo = this.getWorkspaceConfiguration().productName;
    if (!this.productNameMemo && fallback) {
      const sourcePath = await this.getSourcePath();
      // TODO: handle undefined
      const pdxInfo = await getPDXInfo(sourcePath!);
      this.productNameMemo = pdxInfo.name;
    }

    return this.productNameMemo;
  }

  async getProductPath(): Promise<string | undefined> {
    if (this.productPathMemo) {
      return this.productPathMemo;
    }

    const outputPath = await this.getOutputPath();
    const productName = await this.getProductName();

    // TODO: handle undefined
    this.productPathMemo = path.resolve(outputPath!, productName!);
    return this.productPathMemo;
  }

  async getGamePath(): Promise<string | undefined> {
    if (this.gamePathMemo) {
      return this.gamePathMemo;
    }

    const productPath = await this.getProductPath();

    this.gamePathMemo = productPath + ".pdx";
    return this.gamePathMemo;
  }

  private getWorkspaceConfiguration(): vscode.WorkspaceConfiguration {
    if (this.workspaceConfigurationMemo) {
      return this.workspaceConfigurationMemo;
    }

    this.workspaceConfigurationMemo = vscode.workspace.getConfiguration(
      PLAYDATE_DEBUG_SECTION
    );
    return this.workspaceConfigurationMemo;
  }
}
