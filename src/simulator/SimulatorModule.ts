import { ContainerModule } from "inversify";
import * as vscode from "vscode";

import { ActivateResult, ExtensionModule } from "../ExtensionModule";
import { TaskType } from "../constants";

import { SimulatorExecutionFactory } from "./SimulatorExecutionFactory";
import { SimulatorTaskProvider } from "./SimulatorTaskProvider";

export class SimulatorModule extends ExtensionModule {
  protected get containerModule(): ContainerModule {
    return new ContainerModule((options) => {
      options.bind(SimulatorExecutionFactory).toSelf();
      options.bind(SimulatorTaskProvider).toSelf();
    });
  }

  activate(): ActivateResult {
    const simulatorTaskProvider = this.container.get(SimulatorTaskProvider, {
      autobind: true,
    });
    return vscode.tasks.registerTaskProvider(
      TaskType.simulator,
      simulatorTaskProvider,
    );
  }
}
