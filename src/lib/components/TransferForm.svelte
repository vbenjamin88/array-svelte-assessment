<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AccountSelect from '$lib/components/AccountSelect.svelte';
	import type { AccountSummary } from '$lib/types/accounts';

	const dispatch = createEventDispatcher<{ submit: void }>();

	export let accounts: AccountSummary[] = [];
	export let fromAccountId = '';
	export let toAccountId = '';
	export let amount = '';
	export let submitDisabled = false;
	export let errorMessage = '';

	function filterAmountInput(value: string): string {
		// Allow only digits and at most one decimal point (no letters, no negative)
		let v = value.replace(/[^0-9.]/g, '');
		const parts = v.split('.');
		if (parts.length > 2) {
			v = parts[0] + '.' + parts.slice(1).join('');
		}
		// Limit to 2 decimal places
		if (parts.length === 2 && parts[1].length > 2) {
			v = parts[0] + '.' + parts[1].slice(0, 2);
		}
		return v;
	}
</script>

<form
	class="form"
	aria-labelledby="transfer-heading"
	aria-describedby="transfer-desc"
	on:submit|preventDefault={() => dispatch('submit')}
>
	<div class="field">
		<label for="transfer-from">Transfer from</label>
		<AccountSelect
			id="transfer-from"
			{accounts}
			value={fromAccountId}
			excludeId={toAccountId}
			ariaLabel="Choose account to transfer from"
			on:change={(e) => (fromAccountId = e.detail)}
		/>
	</div>

	<div class="field">
		<label for="transfer-to">Transfer to</label>
		<AccountSelect
			id="transfer-to"
			{accounts}
			value={toAccountId}
			excludeId={fromAccountId}
			ariaLabel="Choose account to transfer to"
			on:change={(e) => (toAccountId = e.detail)}
		/>
	</div>

	<div class="field">
		<label for="transfer-amount">Amount</label>
		<div class="amount-wrapper">
			<span class="amount-prefix" aria-hidden="true">$</span>
			<input
				id="transfer-amount"
				type="text"
				inputmode="decimal"
				placeholder="0.00"
				value={amount}
				on:input={(e) => (amount = filterAmountInput(e.currentTarget.value))}
				aria-label="Transfer amount in dollars"
				class="input amount-input"
			/>
		</div>
	</div>

	<p class="disclaimer">By continuing, I authorize Northwind Bank to transfer money as indicated</p>

	{#if errorMessage}
		<p class="error" role="alert">{errorMessage}</p>
	{/if}

	<button type="submit" class="button" disabled={submitDisabled} aria-label="Complete transfer">
		Complete transfer
	</button>
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: var(--s-5);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}

	.field label {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
	}

	.input {
		font-family: var(--input-font);
		font-size: 16px;
		font-weight: var(--input-fw);
		color: var(--input-fg-ci);
		background-color: var(--input-bg-ci);
		padding: 16px;
		border: var(--border-size-thin) solid var(--border-ci);
		border-radius: var(--radius-xl);
		min-height: 22px;
	}

	.amount-wrapper {
		display: flex;
		align-items: center;
		border: var(--border-size-thin) solid var(--border-ci);
		border-radius: var(--radius-xl);
		background-color: white;
	}

	.amount-prefix {
		padding: 16px 0 16px 16px;
		font-family: var(--input-font);
		font-size: 16px;
		font-weight: var(--input-fw);
		color: var(--input-fg-ci);
	}

	.amount-input {
		flex: 1;
		border: none;
		border-radius: 0;
		min-height: 22px;
		padding: 16px 16px 16px 8px;
		background-color: white;
		outline: none;
	}

	.amount-input:focus {
		outline: none;
		box-shadow: none;
	}

	.amount-input:-webkit-autofill,
	.amount-input:-webkit-autofill:hover,
	.amount-input:-webkit-autofill:focus,
	.amount-input:-webkit-autofill:active {
		-webkit-box-shadow: 0 0 0 30px white inset !important;
		box-shadow: 0 0 0 30px white inset !important;
		background-color: white !important;
	}

	.input:focus:not(.amount-input) {
		outline: 2px solid var(--primary-ci);
		outline-offset: 2px;
	}

	.input:disabled {
		color: var(--input-disabled-fg-ci);
		cursor: not-allowed;
	}

	.input::placeholder {
		color: var(--input-placeholder-fg-ci);
	}

	.amount-wrapper:focus-within {
		outline: 2px solid var(--primary-ci);
		outline-offset: 2px;
		border-color: var(--primary-ci);
	}

	.disclaimer {
		font-family: var(--text-font);
		font-size: 12px;
		font-weight: 400;
		color: var(--text-secondary-fg-ci);
		text-align: center;
		margin: 0;
		width: 100%;
	}

	.error {
		font-size: var(--text-sm-fs);
		color: var(--c-red-dark);
		margin: 0;
		padding: var(--s-2);
		background-color: var(--c-red-lighter);
		border-radius: var(--radius);
	}

	.button {
		font-family: var(--text-font);
		font-size: 16px;
		font-weight: 600;
		color: var(--c-white);
		background-color: var(--primary-ci);
		border: none;
		border-radius: var(--radius);
		padding: 18.5px var(--s-5);
		cursor: pointer;
	}

	.button:hover:not(:disabled) {
		background-color: var(--c-blue-dark);
	}

	.button:disabled {
		background-color: var(--button-disabled-bg);
		cursor: not-allowed;
		opacity: 1;
	}

	.button:focus-visible {
		outline: 2px solid var(--primary-ci);
		outline-offset: 2px;
	}
</style>
