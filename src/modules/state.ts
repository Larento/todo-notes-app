import { Note } from './note';
import { LocalStorageKey, loadLocalStorage, writeLocalStorage } from './local-storage';
import { deepClone } from './util';

export interface AppData {
	notes: Note[];
}

export interface AppState {
	currentNote: Note | null;
	undoStack: Note[];
	version: number;
	editing: boolean;
	dirty: boolean;
}

function loadState() {
	return loadLocalStorage<AppState>(LocalStorageKey.STATE);
}

function writeState(stateData: AppState) {
	const modifiedStateData = deepClone<AppState>(stateData);
	if (modifiedStateData.currentNote && !modifiedStateData.editing) {
		modifiedStateData.currentNote = null;
	}
	writeLocalStorage<AppState>(modifiedStateData, LocalStorageKey.STATE);
}

export {
	loadState,
	writeState
}
