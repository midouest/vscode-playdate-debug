import { Container, ContainerModule } from "inversify";
import * as vscode from "vscode";

export interface LoadedModules {
  container: Container;
  modules: ExtensionModule[];
}

export type ActivateResult =
  | vscode.Disposable
  | vscode.Disposable[]
  | undefined
  | null;

export interface ExtensionModuleType {
  new (container: Container): ExtensionModule;
}

/**
 * A concrete implementation of ExtensionModule is responsible for binding
 * injectables to the global container and registering any VSCode providers.
 *
 * # Examples
 *
 * ## Load
 *
 * For simple modules that don't register VSCode providers , it is sufficient to
 * provide an implementation of the containerModule abstract property.
 *
 * ```typescript
 * export class MyModule extends ExtensionModule {
 *   protected get containerModule(): ContainerModule {
 *     return new ContainerModule((bind) => {
 *       bind(MyInjectable).toSelf();
 *     });
 *   }
 * }
 * ```
 *
 * ## Conditional Load
 *
 * Some modules may fail to load under certain conditions. These conditions can
 * be handled by overriding the default `load` method implementation. Returning
 * `false` from `load` will prevent any further modules from being loaded or
 * activated.
 *
 * ```typescript
 * export class MyFlakyModule extends ExtensionModule {
 *   protected get containerModule(): ContainerModule {
 *     return new ContainerModule((bind) => {
 *       bind(MyInjectable).toSelf();
 *     });
 *   }
 *
 *   load(): boolean {
 *     if (Math.random() < 0.5) {
 *       return false;
 *     }
 *     return super.load();
 *   }
 * }
 * ```
 *
 * ## Activate
 *
 * Override the activate method to register VSCode providers. The activate
 * static method on the ExtensionModule class will handle registering any
 * disposables returned by the module.
 *
 * ```typescript
 * export class GreetingModule extends ExtensionModule {
 *   protected get containerModule(): ContainerModule {
 *     return new ContainerModule((bind) => {
 *       bind(Greeter).toSelf();
 *     });
 *   }
 *
 *   activate(): ActivateResult {
 *     const greeter = this.container.resolve(Greeter);
 *     const handler = (name: string = 'World') => greeter.greet(name);
 *     return vscode.commands.registerCommand("myExtension.greet", commandHandler);
 *   }
 * }
 * ```
 */
export abstract class ExtensionModule {
  /**
   * The static activate method is used to load and activate a set of concrete
   * extension modules for the given extension context.
   */
  static activate(
    context: vscode.ExtensionContext,
    classes: ExtensionModuleType[]
  ): Container | null {
    const loaded = ExtensionModule.load(...classes);
    if (!loaded) {
      return null;
    }

    const { container, modules } = loaded;

    for (const mod of modules) {
      const disposables = mod.activate();

      if (Array.isArray(disposables)) {
        context.subscriptions.push(...disposables);
      } else if (disposables) {
        context.subscriptions.push(disposables);
      }
    }

    return container;
  }

  /**
   * The static load method is called during the activation process to
   * instantiate the extension modules before they are activated.
   *
   * This method is used by tests to activate modules without an extension
   * context.
   */
  static load(...classes: ExtensionModuleType[]): LoadedModules | null {
    const container = new Container();
    const modules = classes.map((cls) => new cls(container));

    for (const mod of modules) {
      if (!mod.load()) {
        return null;
      }
    }

    return { container, modules };
  }

  constructor(protected container: Container) {}

  /** A ContainerModule that binds the injectables for the current module */
  protected abstract get containerModule(): ContainerModule;

  /**
   * Load the injectables for the current module. This method will halt the
   * entire activation process if it returns false.
   */
  load(): boolean {
    this.container.load(this.containerModule);
    return true;
  }

  /**
   * Register VSCode providers. The static activate method will handle
   * registering disposables returned by this method with VSCode.
   */
  activate(): ActivateResult {
    return null;
  }
}
