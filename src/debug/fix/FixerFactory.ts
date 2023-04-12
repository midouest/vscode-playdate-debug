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
  buildFixer(disableWorkarounds = false): Promise<Fixer | null> {
    if (disableWorkarounds) {
      return Promise.resolve(null);
    }
    const fixer = new Fixer([
      new FixLaunchResponse(),
      new FixRestartResponse(),
      new FixSupportsRestartRequest(),
      new FixSupportsTerminateRequest(),
      new FixVariablesReference(),
      new FixBreakpointVerified(),
    ]);
    return Promise.resolve(fixer);
  }
}
