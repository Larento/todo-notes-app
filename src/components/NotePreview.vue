<template>
	<button
		ref="notePreviewElemRef"
		@click="handleToggleCurrent"
		tabindex="0"
		class="note-preview"
		:class="{ current: current }"
	>
		<div class="note-title">
			<h2 v-if="props.title">{{ props.title }}</h2>
			<div v-else class="empty-note-preview-title"></div>
		</div>
		<div class="todos-preview-container">
			<div v-if="props.todos.length == 0" class="empty-todos-preview"></div>
			<TodoPreview
				v-for="todo in props.todos.slice(0, options.PREVIEW_MAX_TODOS)"
				:key="todo.id"
				:text="todo.text"
				:done="todo.done"
			/>
		</div>
	</button>
</template>

<script lang="ts">
export type NotePreviewElement = InstanceType<typeof NotePreview>;
</script>

<script setup lang="ts">
import { ref } from 'vue';

import { options } from '../modules/options';
import { Todo, NoteID } from '../modules/note';

import TodoPreview from './TodoPreview.vue';

const props = defineProps<{
	id: NoteID;
	title: string;
	todos: Todo[];
}>();

const emit = defineEmits<{
	(e: 'toggle:current', id: NoteID, current: boolean): void;
}>();

const notePreviewElemRef = ref<HTMLDivElement | null>(null);
const current = ref(false);

function disableCurrent() {
	current.value = false;
}

function getID() {
	return props.id;
}

function handleToggleCurrent() {
	current.value = !current.value;
	emit('toggle:current', props.id, current.value);
}

defineExpose({
	focus,
	blur,
	disableCurrent,
	getID
});
</script>
