<script lang="ts">
	import { db } from '$lib/db/client';
	import { fade } from 'svelte/transition';
	import type { Database } from '$lib/db/types';
	import AlertSuccess from './AlertSuccess.svelte';
	import AlertError from './AlertError.svelte';

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
	<AlertSuccess bind:hasBeenAcknowledged={hasBeenSaved} />
{/if}

{#if hasError}
	<AlertError bind:hasBeenAcknowledged={hasError} />
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
