<template>
	<div class="todo-task">
		<Checkbox
			:modelValue="done"
			@update:modelValue="handleDone"
		/>
		<EditableParagraph
			ref="textElemRef"
			placeholder="Введите текст..."
			:editable="true"
			:modelValue="text"
			@update:modelValue="handleText"
		/>
		<div class="todo-controls">
			<ActionButton
				:action="handleActionAdd"
				name="Добавить"
				buttonClass="add"
				icon="/src/assets/add.svg"
			/>
			<ActionButton
				:action="handleActionRemove"
				name="Удалить"
				buttonClass="remove"
				icon="/src/assets/remove.svg"
			/>
		</div>
	</div>
</template>

<script lang="ts">
export type TodoTaskElement = InstanceType<typeof TodoTask>;
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TodoID } from '../modules/note';

import Checkbox from './Checkbox.vue';
import EditableParagraph from './EditableParagraph.vue';
import ActionButton from './ActionButton.vue';

const props = defineProps<{
	id: TodoID;
	text: string;
	done: boolean;
}>();

const emit = defineEmits<{
	(e: 'hook:mounted', id: TodoID): void;
	(e: 'update:text', text: string): void;
	(e: 'update:done', done: boolean): void;
	(e: 'focus:text', id: TodoID): void;
	(e: 'action:add', id: TodoID): void;
	(e: 'action:remove', id: TodoID): void;
}>();

const textElemRef = ref<InstanceType<typeof EditableParagraph> | null>(null);

onMounted(() => {
	emit('hook:mounted', props.id);
});

function handleDone(done: boolean) {
	emit('update:done', done);
}

function handleText(text: string) {
	emit('update:text', text);
}

function handleTextFocus() {
	emit('focus:text', props.id);
}

function handleActionAdd() {
	emit('action:add', props.id);
}

function handleActionRemove() {
	emit('action:remove', props.id);
}

function getID() {
	return props.id;
}

function focusText() { 
	textElemRef.value?.focus();
}

defineExpose({
	getID,
	focusText
});
</script>
