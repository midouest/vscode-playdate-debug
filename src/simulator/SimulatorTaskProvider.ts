import { inject, injectable } from "inversify";

import { ProblemMatcher, TaskType, TASK_SOURCE } from "../constants";
import { TaskProvider } from "../core";

import { SimulatorExecutionFactory } from "./SimulatorExecutionFactory";

@injectable()
export class SimulatorTaskProvider extends TaskProvider {
  constructor(
    @inject(SimulatorExecutionFactory)
    simulatorFactory: SimulatorExecutionFactory
  ) {
    super(simulatorFactory, {
      type: TaskType.simulator,
      problemMatchers: [ProblemMatcher.pdcExternal],
      name: "Run",
      source: TASK_SOURCE,
    });
  }
}
