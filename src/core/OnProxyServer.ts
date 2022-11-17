export interface OnProxyServer {
  /**
   * This method is used to transform messages from the Playdate Simulator
   * before sending them to VSCode.
   */
  onProxyServer(message: any): void;
}
