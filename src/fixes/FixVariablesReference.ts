import { OnProxyServer } from "../OnProxyServer";

/**
 * The Playdate Simulator omits the "variablesReference" property if a
 * variable does not have children. VS Code expects this property to be zero
 * if a variable does not have children. We default the property to zero
 * if it is undefined.
 */
export class FixVariablesReference implements OnProxyServer {
  onProxyServer(message: any): void {
    if (message.type !== "response" || message.command !== "variables") {
      return;
    }

    for (const variable of message.body.variables) {
      variable.variablesReference = variable.variablesReference ?? 0;
    }
  }
}
