import { inject, injectable } from "inversify";

import { ProblemMatcher, TASK_SOURCE, TaskType } from "../constants";
import { TaskProvider } from "../core";

import { PDCExecutionFactory } from "./PDCExecutionFactory";

@injectable()
export class PDCTaskProvider extends TaskProvider {
  constructor(@inject(PDCExecutionFactory) pdcFactory: PDCExecutionFactory) {
    super(pdcFactory, {
      type: TaskType.pdc,
      problemMatchers: [ProblemMatcher.pdcLua, ProblemMatcher.pdcExternal],
      name: "Build",
      source: TASK_SOURCE,
    });
  }
}
