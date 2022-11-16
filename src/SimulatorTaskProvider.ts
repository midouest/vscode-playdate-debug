import { inject, injectable } from "inversify";

import { SimulatorExecutionFactory } from "./SimulatorExecutionFactory";
import { TaskProvider } from "./TaskProvider";
import {
  PDC_EXTERNAL_PROBLEM_MATCHER,
  SIMULATOR_TASK_TYPE,
  TASK_SOURCE,
} from "./constants";

@injectable()
export class SimulatorTaskProvider extends TaskProvider {
  constructor(
    @inject(SimulatorExecutionFactory)
    private simulatorFactory: SimulatorExecutionFactory
  ) {
    super(simulatorFactory, {
      type: SIMULATOR_TASK_TYPE,
      problemMatchers: [PDC_EXTERNAL_PROBLEM_MATCHER],
      name: "Simulator",
      source: TASK_SOURCE,
    });
  }
}
