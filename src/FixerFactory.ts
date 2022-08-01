import { Fix } from "./Fix";
import { Fixer } from "./Fixer";
import {
  FixLaunchResponse,
  FixRestartResponse,
  FixSupportsRestartRequest,
  FixSupportsTerminateRequest,
  FixVariablesReference,
} from "./fixes";

export class FixerFactory {
  buildFixer(disableWorkarounds: boolean): Promise<Fixer> {
    let fixes: Fix[] = [];
    if (!disableWorkarounds) {
      fixes = [
        new FixLaunchResponse(),
        new FixRestartResponse(),
        new FixSupportsRestartRequest(),
        new FixSupportsTerminateRequest(),
        new FixVariablesReference(),
      ];
    }

    const fixer = new Fixer(fixes);
    return Promise.resolve(fixer);
  }
}
