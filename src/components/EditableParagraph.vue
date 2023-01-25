<template>
	<textarea
		class="editable-paragraph"
		ref="textElemRef"
		:value="modelValue.substring(0, props.maxlength)"
		@input="handleInput"
		:disabled="!props.editable"
		:rows="props.rows"
		:maxlength="props.maxlength"
		:placeholder="props.placeholder"
	></textarea>
</template>

<script lang="ts">
export type EditableParagraphElement = InstanceType<typeof EditableParagraph>;
</script>

<script setup lang="ts">
import { ref, shallowRef, withDefaults, onMounted, onBeforeUnmount } from 'vue';

import { options } from '../modules/options';
import { debounce } from '../modules/util';

const props = withDefaults(defineProps<{
	modelValue: string;
	editable?: boolean;
	fluid?: boolean;
	rows?: number;
	maxlength?: number;
	placeholder?: string;
}>(), {
	editable: true,
	fluid: true,
	rows: options.TEXTAREA_MIN_ROWS,
	maxlength: options.TEXTAREA_MAX_LENGTH,
	placeholder: '...',
});

const emit = defineEmits<{
	(e: 'update:modelValue', modelValue: string): void
}>();

const textElemRef = ref<HTMLTextAreaElement | null>(null);
const resizeObserver = shallowRef<ResizeObserver | null>(null);

if (props.fluid) {
	resizeObserver.value = new ResizeObserver(resizeObserverCallback);

	onMounted(() => {
		const elem = textElemRef.value as HTMLTextAreaElement;
		const observer = resizeObserver.value as ResizeObserver;
		calcHeight(elem);
		observer.observe(elem);
	});

	onBeforeUnmount(() => {
		const observer = resizeObserver.value as ResizeObserver;
		observer.disconnect();
	});
}

function resizeObserverCallback(entries: ResizeObserverEntry[]) {
	for (const entry of entries) {
		handleResizeThrottled(entry);
	}
}

const handleResizeThrottled = debounce(
	(entry: ResizeObserverEntry) => {
		handleResize(entry);
	},
options.TEXTAREA_RESIZE_DEBOUNCE_MS);

function handleResize(entry: ResizeObserverEntry) {
	const elem = entry.target as HTMLTextAreaElement;
	calcHeight(elem);
}

function handleInput(event: Event) {
	const elem = event.target as HTMLTextAreaElement;
	emit('update:modelValue', elem.value);
	if (props.fluid) {
		calcHeight(elem);
	}
}

function calcHeight(textElem: HTMLTextAreaElement) {
	// Чтобы определить реальную высоту текста в поле TextArea,
	// необходимо установить наименьшее значение количества строк (1).
	textElem.rows = 1;
	const textHeight = textElem.scrollHeight;
	const lineHeight = parseInt(getComputedStyle(textElem).lineHeight);
	textElem.rows = textHeight / lineHeight;
}

function focus() {
	textElemRef.value?.focus();
}

defineExpose({
	focus
});
</script>
