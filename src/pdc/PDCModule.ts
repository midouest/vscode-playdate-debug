import { ContainerModule } from "inversify";
import * as vscode from "vscode";

import { ActivateResult, ExtensionModule } from "../ExtensionModule";
import { TaskType } from "../constants";

import { PDCExecutionFactory } from "./PDCExecutionFactory";
import { PDCTaskProvider } from "./PDCTaskProvider";

export class PDCModule extends ExtensionModule {
  protected get containerModule(): ContainerModule {
    return new ContainerModule((bind) => {
      bind(PDCExecutionFactory).toSelf();
      bind(PDCTaskProvider).toSelf();
    });
  }

  activate(): ActivateResult {
    const pdcTaskProvider = this.container.resolve(PDCTaskProvider);
    return vscode.tasks.registerTaskProvider(TaskType.pdc, pdcTaskProvider);
  }
}
