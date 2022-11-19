import { ContainerModule } from "inversify";

import { ExtensionModule } from "../ExtensionModule";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { isFolderless } from "./getWorkspaceRoot";

export class CoreModule extends ExtensionModule {
  protected get containerModule(): ContainerModule {
    return new ContainerModule((bind) => {
      bind(ConfigurationResolver).toSelf();
    });
  }

  load(): boolean {
    if (isFolderless()) {
      return false;
    }

    return super.load();
  }
}
