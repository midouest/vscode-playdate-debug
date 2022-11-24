export type CompareFn<T> = (a: T, b: T) => number;

export function sort<T>(arr: T[], fn: CompareFn<T>): T[] {
  const sorted = [...arr];
  sorted.sort(fn);
  return sorted;
}

export function compareAlphabetic(a: string, b: string): number {
  return a.localeCompare(b);
}
