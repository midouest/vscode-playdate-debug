import { ContainerModule } from "inversify";
import * as vscode from "vscode";

import { ActivateResult, ExtensionModule } from "ext/ExtensionModule";
import { PLAYDATE_DEBUG_TYPE } from "ext/constants";

import { FixerFactory } from "./FixerFactory";
import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { ProxyDebugAdapterDescriptorFactory } from "./ProxyDebugAdapterDescriptorFactory";

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
        PLAYDATE_DEBUG_TYPE,
        configProvider
      );

    const descriptorFactory = this.container.resolve(
      ProxyDebugAdapterDescriptorFactory
    );
    const descriptorFactoryDisposable =
      vscode.debug.registerDebugAdapterDescriptorFactory(
        PLAYDATE_DEBUG_TYPE,
        descriptorFactory
      );

    return [configProviderDisposable, descriptorFactoryDisposable];
  }
}
