<template>
	<div class="todo-preview">
		<Checkbox
			:modelValue="props.done"
			:disabled="true"
			tabindex="-1"
		/>
		<p v-if="props.text">{{ props.text }}</p>
		<div v-else class="empty-todo-preview"></div>
	</div>
</template>

<script setup lang="ts">
import Checkbox from './Checkbox.vue';

const props = defineProps<{
	text: string;
	done: boolean;
}>();
</script>
