import { ContainerModule } from "inversify";
import * as vscode from "vscode";

import { ActivateResult, ExtensionModule } from "../ExtensionModule";
import { TaskType } from "../constants";

import { PDCExecutionFactory } from "./PDCExecutionFactory";
import { PDCTaskProvider } from "./PDCTaskProvider";

export class PDCModule extends ExtensionModule {
  protected get containerModule(): ContainerModule {
    return new ContainerModule((options) => {
      options.bind(PDCExecutionFactory).toSelf();
      options.bind(PDCTaskProvider).toSelf();
    });
  }

  activate(): ActivateResult {
    const pdcTaskProvider = this.container.get(PDCTaskProvider, {
      autobind: true,
    });
    return vscode.tasks.registerTaskProvider(TaskType.pdc, pdcTaskProvider);
  }
}
