import { ContainerModule } from "inversify";
import * as vscode from "vscode";

import { ActivateResult, ExtensionModule } from "../ExtensionModule";
import { DebugType } from "../constants";

import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { ProxyDebugAdapterDescriptorFactory } from "./ProxyDebugAdapterDescriptorFactory";
import { FixerFactory } from "./fix";

export class DebugModule extends ExtensionModule {
  protected get containerModule(): ContainerModule {
    return new ContainerModule((options) => {
      options.bind(PlaydateDebugConfigurationProvider).toSelf();
      options.bind(FixerFactory).toSelf();
      options.bind(ProxyDebugAdapterDescriptorFactory).toSelf();
    });
  }

  activate(): ActivateResult {
    const configProvider = this.container.get(
      PlaydateDebugConfigurationProvider,
      { autobind: true },
    );
    const configProviderDisposable =
      vscode.debug.registerDebugConfigurationProvider(
        DebugType.playdate,
        configProvider,
      );

    const descriptorFactory = this.container.get(
      ProxyDebugAdapterDescriptorFactory,
      { autobind: true },
    );
    const descriptorFactoryDisposable =
      vscode.debug.registerDebugAdapterDescriptorFactory(
        DebugType.playdate,
        descriptorFactory,
      );

    return [configProviderDisposable, descriptorFactoryDisposable];
  }
}
