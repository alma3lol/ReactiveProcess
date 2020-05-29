import { ReactiveProcess } from "../ReactiveProcess"
import { OS } from '../OS'
import { Process } from '../Process'

describe('Reactive Process', () => {
	test('should create a process model using create function', (done) => {
		const subscribe: Process.Subscribe = {
			next: (cast) => {
				if (cast.status)
					expect(cast.status).toBeTruthy()
				if (cast.stdout)
					expect(cast.stdout).toBeTruthy();
				if (cast.stderr)
					expect(cast.stderr).toBeTruthy();
			},
			complete: () => done()
		}
		if (OS.detect() === OS.Type.Windows) {
			const model = ReactiveProcess.create("cmd", ["/c", "dir"], subscribe).start()
			expect(model).toBeInstanceOf(ReactiveProcess.Model)
		} else {
			const model = ReactiveProcess.create("ls", ["-lAsh"], subscribe).start()
			expect(model).toBeInstanceOf(ReactiveProcess.Model)
		}
	})
	test('should create a process model using model initation', (done) => {
		const subscribe: Process.Subscribe = {
			next: (cast) => {
				if (cast.status)
					expect(cast.status).toBeTruthy()
				if (cast.stdout)
					expect(cast.stdout).toBeTruthy();
				if (cast.stderr)
					expect(cast.stderr).toBeTruthy();
			},
			complete: () => done()
		}
		if (OS.detect() === OS.Type.Windows) {
			const model = new ReactiveProcess.Model("cmd", ["/c", "dir"], subscribe).start()
			expect(model).toBeInstanceOf(ReactiveProcess.Model)
		} else {
			const model = new ReactiveProcess.Model("ls", ["-lAsh"], subscribe).start()
			expect(model).toBeInstanceOf(ReactiveProcess.Model)
		}
	})
})