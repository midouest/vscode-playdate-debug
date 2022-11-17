import { ContainerModule } from "inversify";
import * as vscode from "vscode";

import { ActivateResult, ExtensionModule } from "ext/ExtensionModule";
import { PDC_TASK_TYPE } from "ext/constants";

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
    return vscode.tasks.registerTaskProvider(PDC_TASK_TYPE, pdcTaskProvider);
  }
}
