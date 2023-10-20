<script lang="ts">
	import { db } from '$lib/db/client';
	import AlertSuccess from './AlertSuccess.svelte';
	import AlertError from './AlertError.svelte';

	interface Props {
		items: Database['public']['Tables']['items']['Row'][];
	}

	export let userId: string;
	export let listItems: Props;
	export let currentItemsMap: Map<number, boolean>;

	let isSaving = false;
	let hasErrorSaving = false;
	let hasBeenSaved = false;

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
		hasBeenSaved = true;
		isSaving = false;
	};
</script>

{#if hasErrorSaving}
	<AlertError bind:hasBeenAcknowledged={hasErrorSaving} />
{/if}

{#if hasBeenSaved}
	<AlertSuccess bind:hasBeenAcknowledged={hasBeenSaved} />
{/if}

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
								<a class="link link-primary" target="_blank" href={link}>{item}</a>
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
