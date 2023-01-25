enum LocalStorageKey {
	NOTES = 'notes',
	STATE = 'state',
}

function loadLocalStorage<T>(key: LocalStorageKey): T | null {
	const data = localStorage.getItem(key);
	if (!data) return null;
	return JSON.parse(data);
}

function writeLocalStorage<T>(data: T, key: LocalStorageKey) {
	localStorage.setItem(key, JSON.stringify(data));
}

export {
	LocalStorageKey,
	loadLocalStorage,
	writeLocalStorage
}
