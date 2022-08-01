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
    const allFixes = [
      new FixLaunchResponse(),
      new FixRestartResponse(),
      new FixSupportsRestartRequest(),
      new FixSupportsTerminateRequest(),
      new FixVariablesReference(),
    ];
    const enabledFixes = disableWorkarounds ? [] : allFixes;

    const fixer = new Fixer(enabledFixes);
    return Promise.resolve(fixer);
  }
}
