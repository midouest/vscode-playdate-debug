import { ContainerModule } from "inversify";
import * as vscode from "vscode";

import { ActivateResult, ExtensionModule } from "../ExtensionModule";
import { DebugType } from "../constants";

import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { ProxyDebugAdapterDescriptorFactory } from "./ProxyDebugAdapterDescriptorFactory";
import { FixerFactory } from "./fix";

export class DebugModule extends ExtensionModule {
  protected get containerModule(): ContainerModule {
    return new ContainerModule((bind) => {
      bind(PlaydateDebugConfigurationProvider).toSelf();
      bind(FixerFactory).toSelf();
      bind(ProxyDebugAdapterDescriptorFactory).toSelf();
    });
  }

  activate(): ActivateResult {
    const configProvider = this.container.resolve(
      PlaydateDebugConfigurationProvider
    );
    const configProviderDisposable =
      vscode.debug.registerDebugConfigurationProvider(
        DebugType.playdate,
        configProvider
      );

    const descriptorFactory = this.container.resolve(
      ProxyDebugAdapterDescriptorFactory
    );
    const descriptorFactoryDisposable =
      vscode.debug.registerDebugAdapterDescriptorFactory(
        DebugType.playdate,
        descriptorFactory
      );

    return [configProviderDisposable, descriptorFactoryDisposable];
  }
}
