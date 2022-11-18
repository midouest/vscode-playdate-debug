import { inject, injectable } from "inversify";

import { ConfigurationResolver } from "../../core";

import { Fix } from "./Fix";
import { FixBreakpointVerified } from "./FixBreakpointVerified";
import { FixLaunchResponse } from "./FixLaunchResponse";
import { FixRestartResponse } from "./FixRestartResponse";
import { FixSupportsRestartRequest } from "./FixSupportsRestartRequest";
import { FixSupportsTerminateRequest } from "./FixSupportsTerminateRequest";
import { FixVariablesReference } from "./FixVariablesReference";
import { Fixer } from "./Fixer";

@injectable()
export class FixerFactory {
  constructor(
    @inject(ConfigurationResolver) private config: ConfigurationResolver
  ) {}

  async buildFixer(disableWorkarounds: boolean): Promise<Fixer> {
    const enabledFixes = await this.resolveFixes(disableWorkarounds);
    const fixer = new Fixer(enabledFixes);
    return Promise.resolve(fixer);
  }

  private async resolveFixes(disableWorkarounds: boolean): Promise<Fix[]> {
    const { sdkVersion } = await this.config.resolve();
    if (sdkVersion >= "1.13.0" || disableWorkarounds) {
      return [];
    }

    return [
      new FixLaunchResponse(),
      new FixRestartResponse(),
      new FixSupportsRestartRequest(),
      new FixSupportsTerminateRequest(),
      new FixVariablesReference(),
      new FixBreakpointVerified(),
    ];
  }
}
