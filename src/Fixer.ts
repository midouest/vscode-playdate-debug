import { OnProxyClient } from "./OnProxyClient";
import { OnProxyServer } from "./OnProxyServer";

export type Fixer = Partial<OnProxyClient> & Partial<OnProxyServer>;

type ClientFix = OnProxyClient & Partial<OnProxyServer>;

export function isClientFix(fixer: Fixer): fixer is ClientFix {
  return fixer.onProxyClient !== undefined;
}

type ServerFix = OnProxyServer & Partial<OnProxyClient>;

export function isServerFix(fixer: Fixer): fixer is ServerFix {
  return fixer.onProxyServer !== undefined;
}
