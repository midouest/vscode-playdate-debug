import { ContainerModule } from "inversify";

import { ExtensionModule } from "ext/ExtensionModule";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { getWorkspaceRoot } from "./getWorkspaceRoot";
import { symbols } from "./symbols";

export class CoreModule extends ExtensionModule {
  protected get containerModule(): ContainerModule {
    return new ContainerModule((bind) => {
      bind(ConfigurationResolver).toSelf().inSingletonScope();
    });
  }

  load(): boolean {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      return false;
    }

    this.container.bind(symbols.workspaceRoot).toConstantValue(workspaceRoot);
    return super.load();
  }
}
