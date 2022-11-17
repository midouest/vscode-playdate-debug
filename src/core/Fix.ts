import { OnProxyClient } from "./OnProxyClient";
import { OnProxyServer } from "./OnProxyServer";

export type Fix = Partial<OnProxyClient> & Partial<OnProxyServer>;

type ClientFix = OnProxyClient & Partial<OnProxyServer>;

export function isClientFix(fixer: Fix): fixer is ClientFix {
  return fixer.onProxyClient !== undefined;
}

type ServerFix = OnProxyServer & Partial<OnProxyClient>;

export function isServerFix(fixer: Fix): fixer is ServerFix {
  return fixer.onProxyServer !== undefined;
}
