<template>
	<div class="note-browser-container">
		<TopBar>
			<template v-slot:title>
				<EditableParagraph
					modelValue="Заметки"
					:rows="1"
					:editable="false"
					:fluid="false"
				/>
			</template>
			<template v-slot:toolbar>
				<ActionButton
					name="Создать"
					buttonClass="create"
					:action="createNote"
					icon="/src/assets/add.svg"
				/>
				<ActionButton
					name="Редактировать"
					buttonClass="edit"
					:action="editNote"
					:disabled="noneSelected"
					icon="/src/assets/edit.svg"
				/>
				<ActionButton
					name="Удалить"
					buttonClass="delete"
					:action="deleteNoteConfirm"
					:disabled="noneSelected"
					icon="/src/assets/delete.svg"
				/>
			</template>
		</TopBar>
		<div class="no-items-notice" v-if="store.noNotes">
			<h2>Еще нет заметок. Создайте новую при помощи кнопки "+" сверху.</h2>
		</div>
		<div class="notes-container" v-else>
			<NotePreview
				v-for="note in store.data.notes"
				ref="notePreviewElemRefs"
				:key="note.id"
				:id="note.id"
				:title="note.title"
				:todos="note.todos"
				@toggle:current="handleCurrentNotePreviewToggle"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { store } from '../modules/store';
import { NoteID, Note, findNoteIndex } from '../modules/note';

import TopBar from './TopBar.vue';
import ActionButton from './ActionButton.vue';
import EditableParagraph from './EditableParagraph.vue';
import NotePreview from './NotePreview.vue';
import { NotePreviewElement } from './NotePreview.vue';
import { ModalResult, ModalOptions } from './Modal.vue';

const noneSelected = computed(() => {
	return store.noNotes || !store.state.currentNote;
});

const notePreviewElemRefs = ref<NotePreviewElement[] | null>([]);

function createNote() {
	const noteID = Date.now();
	const newNote: Note = {
		id: noteID,
		title: "",
		todos: []
	}

	store.startUndoStack(newNote);
	editNote();
}

function editNote() {
	if (store.state.currentNote && !store.state.editing) {
		store.state.editing = true;
	}
}

function deleteNote() {
	const id = store.state.currentNote?.id as NoteID;
	const notes = store.data.notes;
	notes.splice(findNoteIndex(notes, id), 1);
}

async function deleteNoteConfirm() {
	const modalOptions: ModalOptions = {
		title: "Подтвердитe удаление заметки",
		message: `Вы действительно хотите удалить заметку \
			'${store.state.currentNote?.title}'?`,
		primaryText: "Удалить",
		secondaryText: "Отмена",
		modalClass: "delete"
	};

	const answer = await store.modal.askConfirmation(modalOptions);
	if (answer === ModalResult.CONFIRM) {
		deleteNote();
	}
}

function handleCurrentNotePreviewToggle(id: NoteID, current: boolean) {
	if (current) {
		const notes = store.data.notes;
		const focusedNote = notes[findNoteIndex(notes, id)];
		store.stopUndoStack();
		store.startUndoStack(focusedNote);
	} else {
		store.stopUndoStack();
	}

	const notePreviewElems = notePreviewElemRefs.value as NotePreviewElement[];
	for (const previewElem of notePreviewElems) {
		if (!previewElem) continue;

		if (previewElem.getID() !== id) {
			previewElem.disableCurrent();
		}
	}
}
</script>
