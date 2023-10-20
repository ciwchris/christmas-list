<script lang="ts">
	import { db } from '$lib/db/client';
	import Modal from './ConfirmDelete.svelte';
	import NewItem from './NewItem.svelte';

	interface Props {
		items: Database['public']['Tables']['items']['Row'][];
	}

	export let userId: string;
	export let listItems: Props;

	let showModal = false;
	let shouldDelete = false;
	let itemTextToDelete: string;
	let itemIdToDelete: number;
	let hasErrorDeleting = false;

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
</script>

<Modal {handleDelete} bind:showModal bind:itemTextToDelete />

{#if hasErrorDeleting}
	<AlertError bind:hasBeenAcknowledged={hasErrorDeleting} />
{/if}

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
							<a class="link link-primary" target="_blank" href={link}>{item}</a>
						{:else}
							{item}
						{/if}
					</td>
					<td class="italic">{new Date(Date.parse(inserted_at)).toLocaleDateString()}</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="divider mt-10 text-lg text-primary">Add more items</div>
	<NewItem bind:userId bind:listItems />
</div>
