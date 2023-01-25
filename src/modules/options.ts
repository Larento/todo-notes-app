import { AppState } from './state';

const DEFAULT_STATE: AppState = {
	currentNote: null,
	undoStack: [],
	version: 0,
	editing: false,
	dirty: false,
}

export const options = {
	DEFAULT_STATE,
	// Максимальное количество todo в превью заметки.
	PREVIEW_MAX_TODOS: 3,
	TEXTAREA_MIN_ROWS: 1,
	// Максимальное количество символов в поле.
	TEXTAREA_MAX_LENGTH: 1024,
	// Время задержки перед обновлением высоты поля
	// при изменении его размера.
	TEXTAREA_RESIZE_DEBOUNCE_MS: 200,
	UNDO_STACK_MAX_SIZE: 128,
	NOTE_EDITOR_DEBOUNCE_MS: 50,
	NOTE_EDITOR_TITLE_MAX_LENGTH: 96,
};
