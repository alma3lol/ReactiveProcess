import { OS } from '../OS'

describe('OS', () => {
	it('should detect OS', () => {
		let platform = "win32"
		let expected = OS.Type.Windows
		let result = OS.detect(platform)
		expect(result).toEqual(expected)
		platform = "darwin"
		expected = OS.Type.MacOS
		result = OS.detect(platform)
		expect(result).toEqual(expected)
		platform = "linux"
		expected = OS.Type.Linux
		result = OS.detect(platform)
		expect(result).toEqual(expected)
	})
})