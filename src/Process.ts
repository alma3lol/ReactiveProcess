/**
 * Process namespace
 */
export namespace Process {
	/**
	 * Process' status
	 */
	export enum Status {
		Running,
		Stopped
	}
	/**
	 * Typed Subscribe argument
	 */
	export type Subscribe = {
		next: (cast: Process.Subject) => void,
		complete: () => void
	}
	/**
	 * Typed Subject generic type
	 */
	export type Subject = {
		stdout?: string,
		stderr?: string,
		status?: Process.Status
	}
	/**
	 * Sources of casting
	 */
	export enum Sources {
		stdout,
		stderr,
		status
	}
}