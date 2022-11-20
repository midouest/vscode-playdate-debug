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

export abstract class ExtensionModule {
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

  constructor(protected container: Container) {}

  protected abstract get containerModule(): ContainerModule;

  load(): boolean {
    this.container.load(this.containerModule);
    return true;
  }

  activate(): ActivateResult {
    return null;
  }
}
