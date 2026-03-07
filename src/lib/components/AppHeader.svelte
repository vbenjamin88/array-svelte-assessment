<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
	import desktopLogo from '$lib/assets/logo.svg';
	import mobileLogo from '$lib/assets/mobile-logo.svg';
</script>

<header class="header">
	<a href={resolve('/')} class="logo" aria-label="Home">
		<picture>
			<source srcset={mobileLogo} media="(max-width: 767px)" />
			<img src={desktopLogo} alt="Array brand logo" class="logo-image" />
		</picture>
	</a>
	<nav class="nav" aria-label="Main navigation">
		<a
			href={resolve('/')}
			class="nav-link"
			class:active={$page.url.pathname === '/'}
			aria-current={$page.url.pathname === '/' ? 'page' : undefined}
		>
			Accounts
		</a>
		<a
			href={resolve('/transfers')}
			class="nav-link"
			class:active={$page.url.pathname === '/transfers'}
			aria-current={$page.url.pathname === '/transfers' ? 'page' : undefined}
		>
			Transfers
		</a>
	</nav>
</header>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 0 var(--s-6);
	}

	.logo {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
	}

	.logo-image {
		display: block;
		height: 24px;
		width: auto;
	}

	.logo:focus-visible {
		outline: 2px solid var(--primary-ci);
		outline-offset: 2px;
	}

	.nav {
		display: flex;
		gap: var(--s-6);
	}

	.nav-link {
		font-family: var(--text-font);
		font-size: var(--text-fs); /* 16px */
		font-weight: var(--fw-medium); /* 500 */
		line-height: 1;
		letter-spacing: 0;
		color: var(--c-gray-dark);
		text-decoration: none;
		padding: 0;
		border-radius: var(--radius);
		text-align: center;
		min-width: 72px;
	}

	.nav-link:hover {
		color: var(--header-fg-ci);
	}

	.nav-link.active {
		color: var(--primary-ci); /* brand blue */
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--primary-ci);
		outline-offset: 2px;
	}
</style>
