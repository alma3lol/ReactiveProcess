export namespace Process {
	export enum Status {
		Running,
		Stopped
	}
	export type Subscribe = {
		next: (cast: Process.Subject) => void,
		complete: () => void
	}
	export type Subject = {
		stdout?: string,
		stderr?: string,
		status?: Process.Status
	}
	export enum Sources {
		stdout,
		stderr,
		status
	}
}