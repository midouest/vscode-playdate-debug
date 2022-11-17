import { inject, injectable } from "inversify";

import {
  PDC_EXTERNAL_PROBLEM_MATCHER,
  SIMULATOR_TASK_TYPE,
  TASK_SOURCE,
} from "ext/constants";
import { TaskProvider } from "ext/core";

import { SimulatorExecutionFactory } from "./SimulatorExecutionFactory";

@injectable()
export class SimulatorTaskProvider extends TaskProvider {
  constructor(
    @inject(SimulatorExecutionFactory)
    simulatorFactory: SimulatorExecutionFactory
  ) {
    super(simulatorFactory, {
      type: SIMULATOR_TASK_TYPE,
      problemMatchers: [PDC_EXTERNAL_PROBLEM_MATCHER],
      name: "Simulator",
      source: TASK_SOURCE,
    });
  }
}
