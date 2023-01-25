import { reactive, watch } from 'vue';

import { options } from './options';
import { Note, loadNotes, writeNotes } from './note';
import { AppData, loadState, writeState } from './state';
import { deepClone } from './util';

import { ModalElement } from '../components/Modal.vue';

const data: AppData = {
	notes: loadNotes()
}
const state = loadState() ?? options.DEFAULT_STATE;
const modal: ModalElement | null = null;

export const store = reactive({
	data: data,
	state: state,
	modal: modal,
	
	get noNotes(): boolean {
		return this.data.notes.length == 0;
	},

	get undoLength(): number {
		return this.state.undoStack.length;
	},
	
	get currentNoteVersionIndex(): number {
		return this.undoLength - this.state.version - 1;
	},

	updateCurrentNote() {
		const index = this.currentNoteVersionIndex;
		this.state.currentNote = deepClone<Note>(this.state.undoStack[index]) ?? null;
	},

	startUndoStack(note: Note) {
		this.state.currentNote = deepClone<Note>(note);
		this.commitChange();
	},

	stopUndoStack() {
		this.state.undoStack = [];
		this.state.version = 0;
		this.updateCurrentNote();
	},

	commitChange() {
		// При изменении ранней версии заметки (version > 0), необходимо
		// удалить все её более поздние версии.
		if (this.state.version > 0) {
			const index = this.currentNoteVersionIndex;
			this.state.undoStack.splice(index + 1, Infinity);
		}

		// Если размер стека отмены действий равен максимальному значению,
		// то необходимо удалить самую раннюю версию заметки.
		if (this.undoLength == options.UNDO_STACK_MAX_SIZE) {
			this.state.undoStack.shift();
		}

		const newNoteVersion = this.state.currentNote as Note;
		this.state.undoStack.push(deepClone<Note>(newNoteVersion));
		this.state.version = 0;
	},

	undoChange() {
		if (this.state.version < this.undoLength) {
			this.state.version += 1;
		}
		this.updateCurrentNote();
	},

	redoChange() {
		if (this.state.version > 0) {
			this.state.version -= 1;
		}
		this.updateCurrentNote();
	},
});

watch(store.state, () => {
	writeState(store.state);
});

watch(store.data, () => {
	writeNotes(store.data.notes);
});
