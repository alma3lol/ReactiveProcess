export namespace OS {
	export enum Type {
		Windows = "win32",
		Linux = "linux",
		MacOS = "darwin",
		Unsupported = "Unsupported"
	}
	export const detect = (platform: string = process.platform) => {
		return (platform === "win32")
			? OS.Type.Windows
			: (platform === "darwin")
				? OS.Type.MacOS
				: (platform === "linux")
					? OS.Type.Linux
					: OS.Type.Unsupported
	}
}