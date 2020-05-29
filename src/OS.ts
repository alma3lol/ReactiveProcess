/**
 * OS namespace
 */
export namespace OS {
	/**
	 * Types of supported OS
	 */
	export enum Type {
		Windows = "win32",
		Linux = "linux",
		MacOS = "darwin",
		Unsupported = "Unsupported"
	}
	/**
	 * Detect OS from platform
	 * 
	 * @param platform The platform string to detect OS from
	 */
	export const detect = (platform: string = process.platform) => {
		return (platform === "win32")
			? Type.Windows
			: (platform === "darwin")
				? Type.MacOS
				: (platform === "linux")
					? Type.Linux
					: Type.Unsupported
	}
}