<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { AccountSummary } from '$lib/types/accounts';
	import { accountLabel as getAccountLabel } from '$lib/utils/accounts';
	import { clickOutside } from '$lib/actions/clickOutside';

	const dispatch = createEventDispatcher<{ change: string }>();

	export let accounts: AccountSummary[] = [];
	export let value = '';
	export let placeholder = 'Choose account';
	export let id = 'account-select';
	export let ariaLabel = 'Choose account';
	export let excludeId = '';

	$: selectedAccount = accounts.find((a) => a.account_id === value);
	$: options = accounts.filter((a) => a.account_id !== excludeId);

	function balanceText(account: AccountSummary): string {
		return `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} available`;
	}

	function select(accountId: string): void {
		dispatch('change', accountId);
		open = false;
	}

	let open = false;

	function toggle(): void {
		open = !open;
	}

	let selectNode: HTMLDivElement;
</script>

<div
	class="account-select"
	bind:this={selectNode}
	use:clickOutside={() => open && (open = false)}
	role="combobox"
	aria-expanded={open}
	aria-haspopup="listbox"
	aria-controls={id + '-listbox'}
	aria-label={ariaLabel}
>
	<button
		type="button"
		class="select-trigger"
		class:is-placeholder={!selectedAccount}
		on:click={toggle}
		aria-label={ariaLabel}
	>
		{#if selectedAccount}
			<span class="trigger-content">
				<span class="line1">{getAccountLabel(selectedAccount)}</span>
				<span class="line2">{balanceText(selectedAccount)}</span>
			</span>
		{:else}
			<span class="placeholder">{placeholder}</span>
		{/if}
		<span class="arrow" aria-hidden="true">›</span>
	</button>

	{#if open}
		<ul id={id + '-listbox'} class="dropdown" role="listbox" aria-label={ariaLabel}>
			{#each options as account (account.account_id)}
				{#if account.account_status?.toLowerCase() === 'active'}
					<li
						role="option"
						tabindex="-1"
						aria-selected={account.account_id === value}
						class="option"
						class:selected={account.account_id === value}
						on:click|stopPropagation={() => select(account.account_id)}
						on:keydown|stopPropagation={(e) => e.key === 'Enter' && select(account.account_id)}
					>
						<span class="option-content">
							<span class="line1">{getAccountLabel(account)}</span>
							<span class="line2">{balanceText(account)}</span>
						</span>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</div>

<style>
	.account-select {
		position: relative;
	}

	.select-trigger {
		width: 100%;
		text-align: left;
		font-family: var(--input-font);
		font-size: 16px;
		font-weight: 400;
		color: var(--text-fg-ci);
		background-color: var(--input-bg-ci);
		padding: 16px;
		padding-right: 48px;
		min-height: 54px;
		border: var(--border-size-thin) solid var(--border-ci);
		border-radius: var(--radius-xl);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.select-trigger:focus {
		outline: 2px solid var(--primary-ci);
		outline-offset: 2px;
	}

	.select-trigger.is-placeholder {
		color: var(--primary-ci);
	}

	.trigger-content,
	.option-content {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.trigger-content .line1,
	.option-content .line1 {
		font-size: 16px;
		font-weight: 400;
		color: var(--text-fg-ci);
	}

	.trigger-content .line2,
	.option-content .line2 {
		font-size: 12px;
		font-weight: 400;
		color: var(--text-light-fg-ci);
	}

	.placeholder {
		font-size: 16px;
		font-weight: 400;
	}

	.arrow {
		position: absolute;
		right: 16px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 18px;
		color: var(--text-light-fg-ci);
		pointer-events: none;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin: 0;
		padding: var(--s-2);
		list-style: none;
		background: var(--c-white);
		border: var(--border-size-thin) solid var(--border-ci);
		border-radius: var(--radius-xl);
		box-shadow: var(--shadow-lg);
		z-index: var(--layer-5);
		margin-top: 4px;
		max-height: 280px;
		overflow-y: auto;
	}

	.option {
		padding: 12px 16px;
		cursor: pointer;
		border-radius: var(--radius-lg);
	}

	.option:hover {
		background-color: var(--c-gray-lighter);
	}

	.option.selected {
		background-color: var(--c-blue-lightest);
	}
</style>
