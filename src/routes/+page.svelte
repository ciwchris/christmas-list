<script lang="ts">
	import { onMount } from 'svelte';
	import { db } from '$lib/db/client';
	import type { AuthSession, User } from '@supabase/supabase-js';
	import Auth from '$lib/Auth.svelte';
	import List from '$lib/List.svelte';

	let hasLoaded = false;
	let session: AuthSession | null;
	let userId: string;

	onMount(() => {
		db.auth.getSession().then(({ data }) => {
			session = data.session;
			if (session == null || session.user == null) {
				console.log('Could not retrieve user or session');
			} else {
				userId = session.user.id;
			}
			hasLoaded = true;
		});

		db.auth.onAuthStateChange((_event, _session) => {
			session = _session;
		});
	});
</script>

{#if hasLoaded}
	<div class="container" style="padding: 50px 0 100px 0">
		{#if !session}
			<Auth />
		{:else}
			<List {userId} />
		{/if}
	</div>
{/if}
