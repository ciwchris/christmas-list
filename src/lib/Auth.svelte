<script lang="ts">
	import { db } from '$lib/db/client';
	import { fade } from 'svelte/transition';

	let loading = false;
	let email = '';
	let hasEmailBeenSent = false;
	let hasErrorSendingEmail = false;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await db.auth.signInWithOtp({ email });
			if (error) throw error;
			hasEmailBeenSent = true;
		} catch (error) {
			if (error instanceof Error) {
				hasErrorSendingEmail = true;
			}
		} finally {
			loading = false;
		}
	};
</script>

{#if hasEmailBeenSent}
	<div class="alert alert-success mb-4" transition:fade={{ delay: 250, duration: 300 }}>
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
		<span>Check email for link to sign in.</span>
	</div>
{/if}

{#if hasErrorSendingEmail}
	<div class="alert alert-error mb-4" transition:fade={{ delay: 250, duration: 300 }}>
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
		<span>Error! Could not send sign in link to the email address.</span>
	</div>
{/if}

<form on:submit|preventDefault={handleLogin}>
	<div class="ml-2 mr-2">
		<h2 class="text-base font-semibold text-gray-900">Sign in</h2>
		<p class="mt-1 text-sm text-gray-600">Sign by sending a link to your email address</p>

		<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
			<div class="sm:col-span-4">
				<label for="email-address" class="text-sm">Email address</label>
				<div class="mt-2">
					<input
						type="email"
						name="email-address"
						id="email-address"
						autocomplete="email"
						class="input input-bordered w-full max-w-xs focus:outline-none"
						placeholder="Your email address"
						bind:value={email}
					/>
				</div>
			</div>
		</div>

		<div class="mt-10 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
			<button type="submit" disabled={loading} class="sm:col-span-2 btn btn-primary">
				<span>{loading ? 'Loading' : 'Send link'}</span>
			</button>
		</div>
	</div>
</form>
