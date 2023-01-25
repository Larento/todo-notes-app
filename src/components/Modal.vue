<template>
	<div
		v-if="!state.pendingAction.done"
		class="modal-container"
		:class="state.options.modalClass"
	>
		<div class="modal">
			<h3 class="title">{{ state.options.title }}</h3>
			<p class="message">{{ state.options.message }}</p>
			<ActionButton
				:action="cancelAction"
				name="Отменить"
				buttonClass="cancel"
				icon="/src/assets/exit.svg"
			/>
			<ActionButton
				:action="denyAction"
				name="Отказать"
				buttonClass="deny"
			>
				<span>{{ state.options.secondaryText }}</span>
			</ActionButton>
			<ActionButton
				:action="confirmAction"
				name="Подтвердить"
				buttonClass="confirm"
			>
				<span>{{ state.options.primaryText }}</span>
			</ActionButton>
		</div>
	</div>
</template>

<script lang="ts">
export type ModalElement = InstanceType<typeof Modal>;

export enum ModalResult {
	CONFIRM,
	DENY,
	CANCEL
}

export interface ModalOptions {
	title: string;
	message: string;
	primaryText: string;
	secondaryText: string;
	modalClass: string;
}

interface ModalState {
	pendingAction: Deferred<ModalResult>;
	options: ModalOptions;
}
</script>

<script setup lang="ts">
import { reactive } from 'vue';
import { Deferred } from '../modules/util.js';
import ActionButton from './ActionButton.vue';

const state = reactive<ModalState>({
	pendingAction: new Deferred<ModalResult>(true),
	options: {
		title: "",
		message: "",
		primaryText: "",
		secondaryText: "",
		modalClass: ""
	},
});

async function askConfirmation(options: ModalOptions): Promise<ModalResult> {
	state.options = options;
	state.pendingAction = new Deferred<ModalResult>();
	return await state.pendingAction.promise;
}

function confirmAction() {
	state.pendingAction.resolve(ModalResult.CONFIRM);
}

function denyAction() {
	state.pendingAction.resolve(ModalResult.DENY);
}

function cancelAction() {
	state.pendingAction.resolve(ModalResult.CANCEL);
}

function inModal(): boolean {
	return !state.pendingAction.done;
}

defineExpose({
	askConfirmation,
	inModal
});
</script>
