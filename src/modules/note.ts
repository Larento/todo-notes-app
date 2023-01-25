import { LocalStorageKey, loadLocalStorage, writeLocalStorage } from './local-storage.ts';
import { deepClone } from './util.ts';

type NoteID = number | string;
type TodoID = number | string;

interface Note {
	id: NoteID;
	title: string;
	todos: Todo[];
}

interface Todo {
	id: TodoID;
	text: string;
	done: boolean;
}

function findTodoIndex(note: Note, todoID: TodoID): number {
	const index = note.todos.findIndex(todo => todo.id === todoID);
	return (index != -1) ? index : null;
}

function findNoteIndex(notes: Note[], noteID: NoteID): number {
	const index = notes.findIndex(note => note.id === noteID);
	return (index != -1) ? index : null;
}

function loadNotes() {
	return loadLocalStorage<Note[]>(LocalStorageKey.NOTES) ?? [];
}

function writeNotes(notesData: Note[]) {
	writeLocalStorage<Note[]>(notesData, LocalStorageKey.NOTES);
}


export {
	TodoID,
	Todo,
	NoteID,
	Note,
	findTodoIndex,
	findNoteIndex,
	loadNotes,
	writeNotes,
}
