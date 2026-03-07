<script lang="ts">
	import AppHeader from '$lib/components/AppHeader.svelte';

	export let ariaLabel = 'Page content';
	export let rightAriaLabel = 'Sidebar';
</script>

<div class="page">
	<section class="shell" aria-label={ariaLabel}>
		<AppHeader />
		<div class="two-col">
			<div class="left-col">
				<slot name="left" />
			</div>
			<aside class="right-col" aria-label={rightAriaLabel}>
				<slot name="right" />
			</aside>
		</div>
	</section>
</div>
