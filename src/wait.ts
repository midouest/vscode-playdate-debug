/**
 * Wait is used to delay an operation for a given number of milliseconds using
 * async/await syntax.
 *
 * @param ms The number of milliseconds to wait for
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
