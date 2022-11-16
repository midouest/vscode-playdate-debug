import { ContainerModule } from "inversify";

import { ConfigurationResolver } from "./ConfigurationResolver";
import { FixerFactory } from "./FixerFactory";
import { PDCExecutionFactory } from "./PDCExecutionFactory";
import { PDCTaskProvider } from "./PDCTaskProvider";
import { PlaydateDebugConfigurationProvider } from "./PlaydateDebugConfigurationProvider";
import { ProxyDebugAdapterDescriptorFactory } from "./ProxyDebugAdapterDescriptorFactory";
import { SimulatorExecutionFactory } from "./SimulatorExecutionFactory";
import { SimulatorTaskProvider } from "./SimulatorTaskProvider";

export const containerModule = new ContainerModule((bind) => {
  bind(ConfigurationResolver).toSelf();
  bind(PlaydateDebugConfigurationProvider).toSelf();
  bind(FixerFactory).toSelf();
  bind(ProxyDebugAdapterDescriptorFactory).toSelf();
  bind(PDCExecutionFactory).toSelf();
  bind(PDCTaskProvider).toSelf();
  bind(SimulatorExecutionFactory).toSelf();
  bind(SimulatorTaskProvider).toSelf();
});
