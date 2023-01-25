// Необходимо для обработчика событий изменения размера.
// Позволяет обрабатывать события только по истечению промежутка времени,
// при условии, что вызовов обработчика в этот промежуток не происходило.
export function debounce(callback: (...args: any[]) => void, ms: number): typeof callback {
	let hold = false;
	return function(...args) {
		if (!hold) {
			setTimeout(() => {
				callback(...args);
				hold = false;
			}, ms);
			hold = true;
		}
	}
}

export function deepClone<T>(obj: T): T {
	return (obj) ? JSON.parse(JSON.stringify(obj)) : null;
}

// Обертка над Promise для отложенного (deferred) вызова обработчиков.
export class Deferred<T> {
	readonly promise: Promise<T>;
	private _done: boolean;
	private _resolve: (value: T) => void;
	private _reject: (reason: Error) => void;

	constructor(done: boolean = false) {
		this._done = done;
		this._resolve = () => {};
		this._reject = () => {};
		this.promise = new Promise<T>((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
	}

	resolve(value: T): void {
		if (this._done) return;
		this._resolve(value);
		this._done = true;
	}

	reject(reason: Error): void {
		if (this._done) return;
		this._reject(reason);
		this._done = true;
	}

	get done() {
		return this._done;
	}
}
