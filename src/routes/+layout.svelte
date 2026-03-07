<script lang="ts">
	import '../app.css';
</script>

<div class="app">
	<main class="main">
		<slot />
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: var(--c-gray-lightest);
	}

	.main {
		flex: 1;
		max-width: 1440px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
	}
</style>
