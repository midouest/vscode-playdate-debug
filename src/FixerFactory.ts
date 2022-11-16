import { inject, injectable } from "inversify";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { Fix } from "./Fix";
import { Fixer } from "./Fixer";
import {
  FixLaunchResponse,
  FixRestartResponse,
  FixSupportsRestartRequest,
  FixSupportsTerminateRequest,
  FixVariablesReference,
} from "./fixes";

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
    if (sdkVersion >= "1.12.3" || disableWorkarounds) {
      return [];
    }

    return [
      new FixLaunchResponse(),
      new FixRestartResponse(),
      new FixSupportsRestartRequest(),
      new FixSupportsTerminateRequest(),
      new FixVariablesReference(),
    ];
  }
}
