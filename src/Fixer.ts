import { OnProxyClient } from "./OnProxyClient";
import { OnProxyServer } from "./OnProxyServer";

export type Fixer = Partial<OnProxyClient> & Partial<OnProxyServer>;

export function isClientFix(
  fixer: Fixer
): fixer is OnProxyClient & Partial<OnProxyServer> {
  return fixer.onProxyClient !== undefined;
}

export function isServerFix(
  fixer: Fixer
): fixer is OnProxyServer & Partial<OnProxyClient> {
  return fixer.onProxyServer !== undefined;
}
