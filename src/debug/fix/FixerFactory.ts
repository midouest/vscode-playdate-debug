import { injectable } from "inversify";

import { FixBreakpointVerified } from "./FixBreakpointVerified";
import { FixLaunchResponse } from "./FixLaunchResponse";
import { FixRestartResponse } from "./FixRestartResponse";
import { FixSupportsRestartRequest } from "./FixSupportsRestartRequest";
import { FixSupportsTerminateRequest } from "./FixSupportsTerminateRequest";
import { FixVariablesReference } from "./FixVariablesReference";
import { Fixer } from "./Fixer";

@injectable()
export class FixerFactory {
  async buildFixer(): Promise<Fixer> {
    const enabledFixes = [
      new FixLaunchResponse(),
      new FixRestartResponse(),
      new FixSupportsRestartRequest(),
      new FixSupportsTerminateRequest(),
      new FixVariablesReference(),
      new FixBreakpointVerified(),
    ];
    const fixer = new Fixer(enabledFixes);
    return Promise.resolve(fixer);
  }
}
