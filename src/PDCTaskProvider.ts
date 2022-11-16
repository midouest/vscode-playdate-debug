import { inject, injectable } from "inversify";

import { PDCExecutionFactory } from "./PDCExecutionFactory";
import { TaskProvider } from "./TaskProvider";
import {
  PDC_EXTERNAL_PROBLEM_MATCHER,
  PDC_LUA_PROBLEM_MATCHER,
  PDC_TASK_TYPE,
  TASK_SOURCE,
} from "./constants";

@injectable()
export class PDCTaskProvider extends TaskProvider {
  constructor(
    @inject(PDCExecutionFactory) private pdcFactory: PDCExecutionFactory
  ) {
    super(pdcFactory, {
      type: PDC_TASK_TYPE,
      problemMatchers: [PDC_LUA_PROBLEM_MATCHER, PDC_EXTERNAL_PROBLEM_MATCHER],
      name: "Build",
      source: TASK_SOURCE,
    });
  }
}
