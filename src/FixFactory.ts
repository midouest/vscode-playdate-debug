import { Fix } from "./Fix";
import { FixLaunchResponse } from "./FixLaunchResponse";
import { FixSupportsTerminateRequest } from "./FixSupportsTerminateRequest";
import { FixVariablesReference } from "./FixVariablesReference";

export class FixFactory {
  getFixes(): Promise<Fix[]> {
    return Promise.resolve([
      new FixLaunchResponse(),
      new FixSupportsTerminateRequest(),
      new FixVariablesReference(),
    ]);
  }
}
