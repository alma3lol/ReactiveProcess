# ReactiveProcess
An npm process moduling package made with RxJS

## Installation

Using npm:  
`npm install --save @alma3lol/reactive-process`  
Using yarn:  
`yarn add @alma3lol/reactive-process`

## Usage

Simple enough:  
```ts
import { ReactiveProcess } from '@alma3lol/reactive-process';

const ls = ReactiveProcess.create("ls", ["-lAsh"], {
	next: (cast) => { /* handle cast */ },
	complete: () => { /* handle complete */ }
});
```

## **cast** Object

The `cast` object is just an object with 1 of 3 properties: `stdout`, `stderr` or `status`.  

`Stdout`: This is the output of the process.  
`Stderr`: This is the error stream of the process.  
`Status`: This is the status of the process. It can be either `Running` or `Stopped`.

## Other process properties & functions

### Properties

The process has other properties including all RxJS `Subject`'s and the following:  
- `cmd`: The executed command.
- `args`: Arguments passwed to the command.
- `process`: The core process.
- `pid`: The process ID.
- `exitCode`: The process exit code.

### Functions

Functions include all RxJS `Subject`'s and `start` function:  
- `start`: A function to start the process. (see [blow](#start) for more details)

## Usage with MobX

Reactive Process is a actually a class that extends RxJS' `Subject`, which can be treated as a Model.  
The base class name for Reactive Process is `Model` and the return value of `ReactiveProcess.create(...)` is an instance of [Model](#model)

In code, it should look as follows:

```ts
import { observable } from 'mobx';
import { ReactiveProcess } from '@alma3lol/reactive-process';

class Processes {
	@observable processes: ReactiveProcess.Model[] = [];
	addProcess(process: ReactiveProcess.Model) {
		this.processes.push(process);
	}
}
```

## Model

The `Model` class is an extend of RxJS' `Subject` and inherts all of it's functionality.  
You can subscribe to it manually whenever/wherever needed.

## ReactiveProcess.create vs ReactiveProcess.Model

There's a small difference between `.create` & `.Model` in `ReactiveProcess`: *Using `.Model` doesn't start the process upon initiation.*

To start the process when using `.Model`, you need to call `Model.start`:

```ts
const model = new ReactiveProcess.Model(...);
model.start();
/* OR */
const model = new ReactiveProcess.Model(...).start();
```

## Start

This function has the following call signature:

```ts
() => this
```

It returns `this` which is the model's instance itself.

## GOALS

- Add support for deamon process
- Add stdin support