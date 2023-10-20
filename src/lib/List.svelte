<script lang="ts">
	import { db } from '$lib/db/client';
	import type { Database } from '$lib/db/types';
	import { onMount } from 'svelte';
	import Header from './Header.svelte';
	import OwnerList from './OwnerList.svelte';
	import ShopperList from './ShopperList.svelte';
	import NewItem from './NewItem.svelte';
	import EmptyListPrompt from './EmptyListPrompt.svelte';
	import AlertSuccess from './AlertSuccess.svelte';
	import AlertError from './AlertError.svelte';

	interface Props {
		items: Database['public']['Tables']['items']['Row'][];
	}

	export let userId: string;

	let hasLoaded = false;
	let listUserId = userId;
	let hasErrorFetching = false;
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
			if (listItems.items.length > 0) listUserId = listItems.items[0].user_id;
			hasErrorFetching = false;
		}
	};
</script>

<Header />

{#if hasLoaded}
	{#if !listItems || listItems.items.length == 0}
		<NewItem bind:userId bind:listItems />
		<EmptyListPrompt />
	{:else if listUserId == userId}
		<OwnerList bind:userId bind:listItems />
	{:else}
		<ShopperList bind:userId bind:listItems bind:currentItemsMap />
	{/if}
{:else}
	<div class="grid justify-items-center">
		<span class="loading loading-spinner loading-sm mt-20" />
	</div>
{/if}
