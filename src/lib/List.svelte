<script lang="ts">
	import { fade } from 'svelte/transition';
	import { db } from '$lib/db/client';
	import type { Database } from '$lib/db/types';
	import { onMount } from 'svelte';

	interface Props {
		items: Database['public']['Tables']['items']['Row'][];
	}

	export let userId: string;

	let hasLoaded = false;
	let listUserId = userId;
	let isSaving = false;
	let hasErrorSaving = false;
	let hasErrorFetching = false;
	let hasBeenSaved = false;
	let currentItemsMap = new Map<number, boolean>();
	let listItems: Props = { items: [] };

	onMount(() => {
		fetchItems();
	});

	const fetchItems = async () => {
		let { data, error } = await db.from('items').select().order('id', { ascending: true });
		hasLoaded = true;
		if (error) {
			hasErrorFetching = true;
		} else {
			listItems.items = data || [];
			listItems.items.forEach((item) =>
				currentItemsMap.set(item.id, item?.has_been_purchased ?? false)
			);
			listUserId = listItems.items[0].user_id;
			hasErrorFetching = false;
		}
	};
	const handleSaving = async () => {
		isSaving = true;

		let newItemsPurchased = listItems.items.filter(
			(item) => currentItemsMap.get(item.id) != item.has_been_purchased
		);
		hasErrorSaving = false;
		let purchaseDate = new Date(Date.now()).toISOString();
		for await (const item of newItemsPurchased) {
			const { error } = await db
				.from('items')
				.update({
					has_been_purchased: item.has_been_purchased,
					purchased_by_user_id: item.has_been_purchased ? userId : null,
					purchased_at: item.has_been_purchased ? purchaseDate : null
				})
				.eq('id', item.id);
			currentItemsMap.set(item.id, item.has_been_purchased ?? false);
			if (error) {
				hasErrorSaving = true;
			}
		}
		isSaving = false;
	};
</script>

<h1 class="text-3xl font-bold ml-3">Christmas list</h1>

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

{#if hasErrorSaving}
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
		<span>Could not save items</span>
		<div>
			<button class="btn btn-sm btn-primary" on:click={() => (hasErrorSaving = false)}>OK</button>
		</div>
	</div>
{/if}

{#if hasLoaded}
	{#if listUserId == userId}
		<div class="ml-2 mr-2 mt-8">
                 <table class="table">
                     <thead>
                         <tr>
                             <th class="min-w-max"></th>
                             <th class="ml-3">Added date</th>
                         </tr>
                     </thead>
                     <tbody>
                        {#each listItems.items as { item, inserted_at, link }}
                         <tr>
                             <td>
                             {#if link}
                                 <a class="link link-primary" href="{link}">{item}</a>
                             {:else}
                                 {item}
                             {/if}
                             </td>
                             <td class="italic">{(new Date(Date.parse(inserted_at))).toLocaleDateString()}</td>
                         </tr>
                        {/each}
                    </tbody>
                </table>
		</div>
	{:else}
		<form on:submit|preventDefault={handleSaving}>
			<div class="ml-2 mr-2 mt-8">
                 <table class="table">
                     <thead>
                         <tr>
                             <th class="min-w-fit"></th>
                             <th class="min-w-max"></th>
                             <th class="ml-3">Purchased date</th>
                         </tr>
                     </thead>
                     <tbody>
						{#each listItems.items as { item, has_been_purchased, purchased_by_user_id, purchased_at }, index}
                         <tr>
                             <td class="max-w-fit">
										<input
											type="checkbox"
											id="todo{index}"
											name="todos"
											class="checkbox checkbox-primary mr-3"
											bind:checked={has_been_purchased}
											disabled={purchased_by_user_id != null && purchased_by_user_id != userId}
										/>
                             </td>
                             <td class="min-w-max">
                             {#if link}
                                 <a class="link link-primary" href="{link}">{item}</a>
                             {:else}
                                 {item}
                             {/if}
                             </td>
                             <td class="ml-3 italic">
                             {#if purchased_at}
                                 <span class="ml-3">{(new Date(Date.parse(purchased_at))).toLocaleDateString()}</span>
                             {/if}
                             </td>
                         </tr>
						{/each}
                     <tbody>
                </table>
				<div class="mt-10 grid xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 grid-cols-1">
					<button type="submit" disabled={isSaving} class="btn btn-primary">
						<span>{isSaving ? 'Saving' : 'Save purchases'}</span>
					</button>
				</div>
			</div>
		</form>
	{/if}
{:else}
	<div class="grid justify-items-center">
		<span class="loading loading-spinner loading-sm mt-20" />
	</div>
{/if}
