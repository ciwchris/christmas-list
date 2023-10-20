<script lang="ts">
	import { db } from '$lib/db/client';
	import { fade } from 'svelte/transition';
	import type { Database } from '$lib/db/types';

	interface Props {
		items: Database['public']['Tables']['items']['Row'][];
	}

	export let userId: string;
	export let listItems: Props;

	let newItemText = '';
	let newItemLink = '';
	let hasBeenSaved = false;
	let hasError = false;

	const handleInsert = async () => {
		const { data: item, error } = await db
			.from('items')
			.insert({ item: newItemText, link: newItemLink, user_id: userId })
			.select()
			.single();
		if (error) {
			hasError = true;
		} else {
			hasBeenSaved = true;
			listItems.items = [...listItems.items, item];
		}
		newItemText = '';
		newItemLink = '';
	};
</script>

{#if hasBeenSaved}
	<div class="alert alert-success mt-4" transition:fade={{ delay: 250, duration: 300 }}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="stroke-current shrink-0 w-6 h-6"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>Items have been saved</span>
		<div>
			<button class="btn btn-sm btn-primary" on:click={() => (hasBeenSaved = false)}>OK</button>
		</div>
	</div>
{/if}

{#if hasError}
	<div class="alert alert-error mt-4" transition:fade={{ delay: 250, duration: 300 }}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="stroke-current shrink-0 h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>Could not delete item</span>
		<div>
			<button class="btn btn-sm btn-primary" on:click={() => (hasError = false)}>OK</button>
		</div>
	</div>
{/if}

<div class="mt-8 grid place-content-center">
	<div class="join">
		<input
			type="text"
			required
			minlen="2"
			class="mr-2 input input-bordered"
			placeholder="Item"
			bind:value={newItemText}
		/>
		<input
			type="text"
			class="mr-2 input input-bordered"
			placeholder="Link"
			bind:value={newItemLink}
		/>
		<button autofocus on:click={() => handleInsert(true)} class="btn btn-primary">Add</button>
	</div>
</div>
