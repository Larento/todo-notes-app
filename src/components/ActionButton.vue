<template>
	<div
		class="action-button"
		:class="props.buttonClass"
	>
		<label>{{ props.name }}</label>
		<button
			:title="props.name"
			:disabled="props.disabled"
			@click="handleClick"
		>
			<inline-svg
				v-if="props.icon"
				class="icon"
				:title="props.name"
				:src="props.icon"
			/>
			<slot></slot>
		</button>
	</div>
</template>

<script setup lang="ts">
import InlineSvg from 'vue-inline-svg';

const props = defineProps<{
	name: string;
	icon?: string;
	action?: () => void;
	disabled?: boolean;
	buttonClass?: string;
}>();

function handleClick() {
	props.action?.();
}
</script>
