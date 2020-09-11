import { Subject } from 'rxjs';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { OS } from './OS';

/**
 * Process' status
 */
export enum Status {
	Running,
	Stopped,
	NotStarted
}

/**
 * Process class
 */
export class Process extends Subject<any> {
	private _process: ChildProcessWithoutNullStreams;
	private _pid?: number;
	private _exitCode?: number;
	private _status: Status = Status.NotStarted;
	constructor(
		private cmd: string,
		private args: string[]
	) { super(); }
	/**
	 * Process object
	 */
	get process() { return this._process; }
	/**
	 * Process ID
	 */
	get pid() { return this._pid; }
	/**
	 * Process exit code
	 */
	get exitCode() { return this._exitCode; }
	/**
	 * Process status
	 */
	get status() { return this._status; }
	/**
	 * Start the process
	 */
	start = () => {
		if (this._process === undefined || this._status === Status.Stopped) {
			this._process = spawn(this.cmd, this.args);
			this._pid = this._process.pid;
			this._exitCode = undefined;
			this._process.stdout.on("data", data => {
				if (this.observers.length > 0) this.next(data);
			});
			this._process.stderr.on("data", data => {
				if (this.observers.length > 0) this.error(data);
			});
			this._status = Status.Running;
			this._process.on("error", (err) => { throw err })
			const exitFunction = (code: number) => {
				this._status = Status.Stopped;
				this._exitCode = code;
				this._pid = undefined;
				if (this.observers.length > 0) this.complete();
			}
			if (OS.detect() === OS.Type.Windows) this._process.on("exit", exitFunction);
			else this._process.on("close", exitFunction);
		}
		return this;
	}
	/**
	 * Stop the process
	 */
	stop = () => {
		if (this._process !== undefined) {
			this._process.kill();
			this._status = Status.Stopped;
			this._exitCode = undefined;
			this._pid = undefined;
		}
		return this;
	}
	/**
	 * Restart the process
	 */
	restart = () => {
		this.stop();
		this.start();
		return this;
	}
	/**
	 * Create a new process instance
	 * 
	 * @param cmd Command to execute
	 * @param args Command's arguments
	 */
	static create(
		cmd: string,
		args: string[]
	) {
		return new this(cmd, args);
	}
}