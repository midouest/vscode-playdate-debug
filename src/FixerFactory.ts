import { FixLaunchResponse } from "./FixLaunchResponse";
import { FixSupportsTerminateRequest } from "./FixSupportsTerminateRequest";
import { FixVariablesReference } from "./FixVariablesReference";
import { Fixer } from "./Fixer";

export class FixerFactory {
  getFixers(): Promise<Fixer[]> {
    return Promise.resolve([
      new FixLaunchResponse(),
      new FixSupportsTerminateRequest(),
      new FixVariablesReference(),
    ]);
  }
}
