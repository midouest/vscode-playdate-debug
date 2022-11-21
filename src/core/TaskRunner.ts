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

export abstract class Chainable {
  chain(this: TaskRunner, next: TaskRunner): TaskRunner {
    return new TaskRunnerChain(this, next);
  }
}

export class TaskRunnerChain implements TaskRunner {
  constructor(private first: TaskRunner, private second: TaskRunner) {}

  async run(onMessage: OnTaskRunnerMessage): Promise<void> {
    await this.first.run(onMessage);
    await this.second.run(onMessage);
  }
}
