<script lang="ts">
	import { fade } from 'svelte/transition';

	export let hasBeenAcknowledged: boolean;
</script>

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
		<button class="btn btn-sm btn-primary" on:click={() => (hasBeenAcknowledged = false)}>OK</button
		>
	</div>
</div>
