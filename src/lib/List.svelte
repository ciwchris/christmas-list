<script lang="ts">
	import { fade } from 'svelte/transition';
	import { db } from '$lib/db/client';
	import type { Database } from '$lib/db/types';
	import { onMount } from 'svelte';
	import Modal from './ConfirmDelete.svelte';

	interface Props {
		items: Database['public']['Tables']['items']['Row'][];
	}

	export let userId: string;

	let showModal = false;
	let shouldDelete = false;
	let itemTextToDelete: string;
	let itemIdToDelete: number;
	let hasLoaded = false;
	let listUserId = userId;
	let isSaving = false;
	let hasErrorSaving = false;
	let hasErrorFetching = false;
	let hasErrorDeleting = false;
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

	const handleDelete = async () => {
		const { error } = await db.from('items').delete().eq('id', itemIdToDelete);
		if (error) {
			hasErrorDeleting = true;
		} else {
			listItems.items = listItems.items.filter((item) => item.id != itemIdToDelete);
		}
		itemIdToDelete = 0;
		itemTextToDelete = '';
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

<Modal {handleDelete} bind:showModal bind:itemTextToDelete />

<div class="navbar bg-base-100">
	<div class="navbar-start text-primary">
		<div class="dropdown">
			<label tabindex="0" class="btn btn-ghost btn-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/></svg
				>
			</label>
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
			>
				<li><a>Items</a></li>
				<li><a>Shoppers</a></li>
			</ul>
		</div>
		<a class="btn btn-ghost normal-case text-xl">Christmas list</a>
	</div>
</div>

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

{#if hasErrorDeleting}
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
			<button class="btn btn-sm btn-primary" on:click={() => (hasErrorDeleting = false)}>OK</button>
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
	{#if !listItems || listItems.items.length == 0}
		<div class="mt-8 bg-gray-50 grid place-content-center min-h-[50vh] italic">
			This list does not contain any items
		</div>
	{:else if listUserId == userId}
		<div class="ml-2 mr-2 mt-8">
			<table class="table">
				<thead>
					<tr>
						<th class="whitespace-nowrap w-1/100" />
						<th class="min-w-max" />
						<th class="ml-3">Added date</th>
					</tr>
				</thead>
				<tbody>
					{#each listItems.items as { id, item, inserted_at, link }}
						<tr>
							<td>
								<button
									on:click={() => {
										showModal = true;
										itemTextToDelete = item;
										itemIdToDelete = id;
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
										/>
									</svg>
								</button>
							</td>
							<td>
								{#if link}
									<a class="link link-primary" href={link}>{item}</a>
								{:else}
									{item}
								{/if}
							</td>
							<td class="italic">{new Date(Date.parse(inserted_at)).toLocaleDateString()}</td>
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
							<th class="whitespace-nowrap w-1/100" />
							<th />
							<th>Purchased date</th>
						</tr>
					</thead>
					<tbody>
						{#each listItems.items as { item, has_been_purchased, purchased_by_user_id, purchased_at, link }, index}
							<tr>
								<td>
									<input
										type="checkbox"
										id="todo{index}"
										name="todos"
										class="checkbox checkbox-primary mr-3"
										bind:checked={has_been_purchased}
										disabled={purchased_by_user_id != null && purchased_by_user_id != userId}
									/>
								</td>
								<td>
									{#if link}
										<a class="link link-primary" href={link}>{item}</a>
									{:else}
										{item}
									{/if}
								</td>
								<td>
									{#if purchased_at}
										{new Date(Date.parse(purchased_at)).toLocaleDateString()}
									{/if}
								</td>
							</tr>
						{/each}
					</tbody><tbody />
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
