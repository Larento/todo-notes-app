<template>
	<button
		class="checkbox"
		:class="{ checked: props.modelValue }"
		@click="toggle"
		:disabled="props.disabled"
	>
		<inline-svg
			class="icon"
			v-if="props.modelValue"
			src="/src/assets/confirm.svg"
		/>
	</button>
</template>

<script setup lang="ts">
import { withDefaults } from 'vue';
import InlineSvg from 'vue-inline-svg';

const props = withDefaults(defineProps<{
	modelValue: boolean;
	disabled?: boolean;
}>(), {
	disabled: false
});

const emit = defineEmits<{
	(e: 'update:modelValue', modelValue: boolean): void
}>();

function toggle() {
	emit('update:modelValue', !props.modelValue);
}
</script>
