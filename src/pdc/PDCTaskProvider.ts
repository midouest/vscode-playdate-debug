import { inject, injectable } from "inversify";

import {
  PDC_EXTERNAL_PROBLEM_MATCHER,
  PDC_LUA_PROBLEM_MATCHER,
  PDC_TASK_TYPE,
  TASK_SOURCE,
} from "ext/constants";
import { TaskProvider } from "ext/core";

import { PDCExecutionFactory } from "./PDCExecutionFactory";

@injectable()
export class PDCTaskProvider extends TaskProvider {
  constructor(@inject(PDCExecutionFactory) pdcFactory: PDCExecutionFactory) {
    super(pdcFactory, {
      type: PDC_TASK_TYPE,
      problemMatchers: [PDC_LUA_PROBLEM_MATCHER, PDC_EXTERNAL_PROBLEM_MATCHER],
      name: "Build",
      source: TASK_SOURCE,
    });
  }
}
