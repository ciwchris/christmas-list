<script lang="ts">
	export let showModal = false;
	export let itemTextToDelete: string;
	export let handleDelete;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<dialog
	class="rounded-lg w-96"
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="relative p-5" on:click|stopPropagation>
		<div class="mt-3 text-center">
			<div class="text-gray-500 mt-2 mb-2 px-7 py-3">
				<p>Confirm deletion of:</p>
				<p class="text-error">{itemTextToDelete}</p>
			</div>
			<div class="flex justify-evenly">
				<button class="btn" autofocus on:click={() => dialog.close()}>Cancel</button>
				<button
					class="btn btn-error"
					autofocus
					on:click={() => {
						dialog.close();
						handleDelete(true);
					}}>Delete</button
				>
			</div>
		</div>
	</div>
</dialog>
