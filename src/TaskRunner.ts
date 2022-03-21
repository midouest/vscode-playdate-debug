export interface TaskRunner {
  run(): Promise<string | undefined>;
}
