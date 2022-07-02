import { Fix } from "./Fix";
import { FixLaunchResponse } from "./FixLaunchResponse";
import { FixSupportsTerminateRequest } from "./FixSupportsTerminateRequest";
import { FixVariablesReference } from "./FixVariablesReference";
import { Fixer } from "./Fixer";

export class FixerFactory {
  buildFixer(disableWorkarounds: boolean): Promise<Fixer> {
    let fixes: Fix[] = [];
    if (!disableWorkarounds) {
      fixes = [
        new FixLaunchResponse(),
        new FixSupportsTerminateRequest(),
        new FixVariablesReference(),
      ];
    }

    const fixer = new Fixer(fixes);
    return Promise.resolve(fixer);
  }
}
