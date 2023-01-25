<template>
	<NoteEditorPage :tabindex="noTabbing ? -1 : 0" v-if="store.state.editing" />
	<NoteBrowserPage :tabindex="noTabbing ? -1 : 0" v-else />
	<Modal ref="modalElemRef" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { store } from './modules/store';

import NoteEditorPage from './components/NoteEditorPage.vue';
import NoteBrowserPage from './components/NoteBrowserPage.vue';
import Modal from './components/Modal.vue';
import { ModalElement } from './components/Modal.vue';

const modalElemRef = ref<ModalElement | null>(null);

onMounted(() => {
	store.modal= modalElemRef.value;
});

const noTabbing = computed(() => {
	return store.modal?.inModal() ?? false;
});
</script>
