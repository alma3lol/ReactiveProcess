import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Subject } from 'rxjs';
import { Process } from './Process';
import { OS } from './OS';

export namespace ReactiveProcess {
	export const create = (cmd: string, args: readonly string[] = [], subscribe: Process.Subscribe): Model => {
		return new Model(cmd, args, subscribe)
	}
	export class Model extends Subject<Process.Subject> {
		readonly cmd: string;
		readonly args: readonly string[];
		private _process: ChildProcessWithoutNullStreams;
		private _pid: number;
		private _exitCode: number;
		public get process(): ChildProcessWithoutNullStreams {
			return this._process;
		}
		public get pid(): number {
			return this._pid;
		}
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