export type OnTaskRunnerMessage = (message: string) => void;

/**
 * The TaskRunner interface is used by the TaskRunnerTerminal to decouple the
 * execution of a task from the VS Code pseudoterminal that runs it.
 */
export interface TaskRunner {
  /**
   * Execute the task.
   *
   * @returns An error message string if the task failed.
   */
  run(onMessage: OnTaskRunnerMessage): Promise<void>;
}
