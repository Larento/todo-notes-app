<template>
	<div class="note-editor-container">
		<TopBar>
			<template v-slot:title>
				<EditableParagraph
					ref="titleElemRef"
					v-model="noteTitle"
					:maxlength="options.NOTE_EDITOR_TITLE_MAX_LENGTH"
					placeholder="Введите название заметки..."
				/>
			</template>
			<template v-slot:toolbar>
				<ActionButton
					:action="saveNote"
					:disabled="!store.state.dirty"
					name="Сохранить"
					buttonClass="save"
					icon="/src/assets/save.svg"
				/>
				<ActionButton
					:action="addTodo"
					name="Добавить"
					buttonClass="add"
					icon="/src/assets/add.svg"
				/>
				<ActionButton
					:action="undoEdit"
					:disabled="noUndo"
					name="Отмена"
					buttonClass="undo"
					icon="/src/assets/undo.svg"
				/>
				<ActionButton
					:action="redoEdit"
					:disabled="noRedo"
					name="Повтор"
					buttonClass="redo"
					icon="/src/assets/redo.svg"
				/>
				<ActionButton
					:action="exitNoteConfirm"
					name="Выйти"
					buttonClass="exit"
					icon="/src/assets/exit.svg"
				/>
			</template>
		</TopBar>
		<div
			class="no-items-notice"
			v-if="store.state.currentNote?.todos.length == 0"
		>
			<h2>Еще нет задач. Создайте новую задачу при помощи кнопки "+" сверху.</h2>
		</div>
		<div class="todos-container">
			<TodoTask
				v-for="todo in store.state.currentNote?.todos"
				ref="todoElemRefs"
				:key="todo.id"
				:id="todo.id" 
				v-model:done="todo.done"
				v-model:text="todo.text"
				@action:add="addTodo"
				@action:remove="removeTodo"
				@hook:mounted="focusTodo"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

import { options } from '../modules/options';
import { store } from '../modules/store';
import { debounce, deepClone } from '../modules/util';
import { TodoID, Todo, Note } from '../modules/note';
import { findTodoIndex, findNoteIndex } from '../modules/note';

import TodoTask from './TodoTask.vue';
import { TodoTaskElement } from './TodoTask.vue';
import TopBar from './TopBar.vue';
import ActionButton from './ActionButton.vue';
import EditableParagraph from './EditableParagraph.vue';
import { EditableParagraphElement } from './EditableParagraph.vue';
import { ModalResult, ModalOptions } from './Modal.vue';

const noUndo = computed(() => {
	return store.state.version == store.undoLength - 1
});
const noRedo = computed(() => store.state.version == 0);
const noteTitle = computed(() => store.state.currentNote?.title ?? '');

const titleElemRef = ref<EditableParagraphElement | null>(null);
const todoElemRefs = ref<TodoTaskElement[] | null>([]);
const focusNewTodos = ref(false);

// При изменении контента заметки, регистрирует совершенное действие.
const handleEdit = debounce(
	(oldNoteVersion, newNoteVersion) => {
		const changedVersion = oldNoteVersion !== newNoteVersion;
		if (!changedVersion) {
			store.state.dirty = true;
			store.commitChange();
		}
	},
options.NOTE_EDITOR_DEBOUNCE_MS);
watch(() => store.state.currentNote, handleEdit, { deep: true});

onMounted(() => {
	titleElemRef.value?.focus();
});

function saveNote() {
	const note = store.state.currentNote as Note;
	let index = findNoteIndex(store.data.notes, note.id);
	if (index == null) {
		index = store.data.notes.length;
	}
	store.state.dirty = false;
	store.data.notes[index] = deepClone(note);
}

function exitNote() {
	store.stopUndoStack();
	store.state.dirty = false;
	store.state.editing = false;
}

async function exitNoteConfirm() {
	let answer = ModalResult.CONFIRM;
	const modalOptions: ModalOptions = {
		title: "Подтвердите выход",
		message: "Вы действительно хотите выйти? \
			Все несохраненные изменения будут потеряны.",
		primaryText: "Выйти",
		secondaryText: "Остаться",
		modalClass: "exit"
	};

	if (store.state.dirty) {
		answer = await store.modal.askConfirmation(modalOptions);
	}
	if (answer === ModalResult.CONFIRM) {
		exitNote();
	}
}

function undoEdit() {
	store.state.dirty = true;
	store.undoChange();
}

function redoEdit() {
	store.state.dirty = true;
	store.redoChange();
}

function getTodoIndex(todoID?: TodoID | null) {
	const note = store.state.currentNote as Note;
	const lastIndex = note.todos.length - 1;
	return findTodoIndex(note, todoID ?? 0) ?? lastIndex + 1;
}

function addTodo(todoID?: TodoID | null) {
	const note = store.state.currentNote as Note;
	const index = getTodoIndex(todoID);

	const newTodo: Todo = {
		id: Date.now(),
		text: "",
		done: false
	};

	note.todos.splice(index + 1, 0, newTodo);
	focusNewTodos.value = true;
}

function removeTodo(todoID?: TodoID | null) {
	const note = store.state.currentNote as Note;
	const index = getTodoIndex(todoID);
	note.todos.splice(index, 1);
}

function focusTodo(todoID: TodoID) {
	if (!focusNewTodos.value) {
		return;
	}

	const todoElems = todoElemRefs.value as TodoTaskElement[];
	for (const todoElem of todoElems) {
		if (!todoElem) continue;

		if (todoElem.getID() === todoID) {
			todoElem.focusText();
		}
	}
	focusNewTodos.value = false;
}
</script>
