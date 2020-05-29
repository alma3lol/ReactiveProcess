import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Subject } from 'rxjs';
import { Process } from './Process';
import { OS } from './OS';

/**
 * ReactiveProcess namespace
 */
export namespace ReactiveProcess {
	/**
	 * Create a process and run it
	 * 
	 * @param cmd Command to execute
	 * @param args Arguments to pass to executed command
	 * @param subscribe Functions used to subscribe to process events
	 */
	export const create = (cmd: string, args: readonly string[] = [], subscribe: Process.Subscribe): Model => {
		return new Model(cmd, args, subscribe)
	}
	/**
	 * Model class
	 * 
	 * @extends {Subject<Process.Subject>}
	 */
	export class Model extends Subject<Process.Subject> {
		/**
		 * Executed command
		 */
		readonly cmd: string;
		/**
		 * Arguments passed to command
		 */
		readonly args: readonly string[];
		private _process: ChildProcessWithoutNullStreams;
		private _pid: number;
		private _exitCode: number;
		/**
		 * Command's process
		 */
		public get process(): ChildProcessWithoutNullStreams {
			return this._process;
		}
		/**
		 * Process ID
		 */
		public get pid(): number {
			return this._pid;
		}
		/**
		 * Exit code
		 */
		public get exitCode(): number {
			return this._exitCode;
		}
		private cast = (value: any, source: Process.Sources) => {
			const next: Process.Subject = (source === Process.Sources.stdout)
				? { stdout: value }
				: (source === Process.Sources.stderr)
					? { stderr: value }
					: { status: value }
			this.next(next)
		}
		constructor(cmd: string, args: readonly string[] = [], subscribe: Process.Subscribe) {
			super()
			this.cmd = cmd
			this.args = args
			this.subscribe(subscribe)
		}
		/**
		 * Starts the process
		 */
		start = (): this => {
			this._process = spawn(this.cmd, this.args)
			this._pid = this._process.pid
			this._process.stdout.on("data", (data) => this.cast(data, Process.Sources.stdout))
			this._process.stderr.on("data", (data) => this.cast(data, Process.Sources.stderr))
			this.cast(Process.Status.Running, Process.Sources.status)
			this._process.on("error", (err) => { throw err })
			const exitFunction = (code: number) => {
				this.cast(Process.Status.Stopped, Process.Sources.status)
				this._exitCode = code
				this.complete()
			}
			if (OS.detect() === OS.Type.Windows) this._process.on("exit", exitFunction)
			else this._process.on("close", exitFunction)
			return this
		}
	}
}