<script lang="ts">
	import TransferForm from '$lib/components/TransferForm.svelte';
	import TransferSummary from '$lib/components/TransferSummary.svelte';
	import RecentTransfers from '$lib/components/RecentTransfers.svelte';
	import PageShell from '$lib/components/PageShell.svelte';
	import transferSuccessIcon from '$lib/assets/transfer_success.svg';
	import transferFailIcon from '$lib/assets/transfer_fail.svg';
	import { accountLabel, accountNameOnly } from '$lib/utils/accounts';
	import type { ActivityItem } from '$lib/types/accounts';

	export let data: {
		accounts: import('$lib/types/accounts').AccountSummary[];
		recentTransfers: import('$lib/types/accounts').ActivityItem[];
		apiAvailable?: boolean;
	};

	const { recentTransfers, apiAvailable } = data;

	// Work on a local, mutable copy so we can update balances after a transfer
	let accounts = data.accounts.map((account) => ({ ...account }));

	let recentTransferItems: ActivityItem[] = [...recentTransfers];

	let fromId = '';
	let toId = '';
	let amountStr = '';
	let formError = '';
	let transferState: 'idle' | 'success' | 'error' = 'idle';
	let successDetails: {
		amount: number;
		from: string;
		to: string;
		date: string;
		confirmation: string;
	} | null = null;
	let errorDetails: string | null = null;

	$: fromAccount = accounts.find((a) => a.account_id === fromId);
	$: toAccount = accounts.find((a) => a.account_id === toId);
	$: amountNum = parseFloat(amountStr) || 0;
	$: canSubmit = !!fromId && !!toId && !!amountStr && amountNum > 0;

	async function handleSubmit(e: Event): Promise<void> {
		e.preventDefault();
		formError = '';
		transferState = 'idle';
		errorDetails = null;
		successDetails = null;

		if (!fromId || !toId) {
			formError = 'Please select both from and to accounts.';
			return;
		}
		if (fromId === toId) {
			formError = 'From and to accounts must be different.';
			return;
		}
		if (!fromAccount || fromAccount.account_status?.toLowerCase() !== 'active') {
			formError = 'Please select an active account to transfer from.';
			return;
		}
		if (!toAccount || toAccount.account_status?.toLowerCase() !== 'active') {
			formError = 'Please select an active account to transfer to.';
			return;
		}
		if (amountNum <= 0 || isNaN(amountNum)) {
			formError = 'Please enter a valid amount greater than 0.';
			return;
		}
		if (fromAccount.balance < amountNum) {
			formError = 'Amount exceeds available balance.';
			return;
		}

		try {
			const response = await fetch('/api/transfer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					fromId,
					toId,
					amount: amountNum
				})
			});

			const data = await response.json();

			if (!response.ok || !data.ok) {
				transferState = 'error';
				errorDetails =
					data?.error ?? 'Your transfer could not be completed due to an unexpected error.';
				return;
			}

			const transfer = data.transfer as {
				amount: number;
				currency: string;
				status: string;
				reference_number?: string;
			};

			const transferDate = new Date().toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric'
			});

			transferState = 'success';
			successDetails = {
				amount: transfer.amount,
				from: accountLabel(fromAccount!),
				to: accountLabel(toAccount!),
				date: transferDate,
				confirmation: transfer.reference_number ?? 'N/A'
			};

			// Optimistically add to recent transfers list using API response
			recentTransferItems = [
				{
					description: `To ${accountNameOnly(toAccount!)}`,
					amount: -transfer.amount,
					date: transferDate,
					account: `From ${accountNameOnly(fromAccount!)}`
				},
				...recentTransferItems
			];
		} catch (error) {
			transferState = 'error';
			errorDetails =
				error instanceof Error
					? error.message
					: 'Your transfer could not be completed due to an unexpected error.';
		}
	}

	function closeSuccess(): void {
		transferState = 'idle';
		successDetails = null;
		fromId = '';
		toId = '';
		amountStr = '';
	}

	function closeError(): void {
		transferState = 'idle';
		errorDetails = null;
	}
</script>

<svelte:window
	on:keydown={(e) =>
		e.key === 'Escape' &&
		(transferState === 'success'
			? closeSuccess()
			: transferState === 'error'
				? closeError()
				: false)}
/>

{#if transferState === 'success' && successDetails}
	<div class="result-page" role="status" aria-labelledby="success-title">
		<div class="result-wrapper">
			<div class="result-container success-container">
				<div class="result-header">
					<img src={transferSuccessIcon} alt="" class="result-icon" width="64" height="64" />
					<h2 id="success-title" class="result-title">Transfer Successful</h2>
					<p class="result-subtitle">Your transfer has successfully been completed</p>
				</div>
				<div class="result-details">
					<div class="result-detail-row">
						<span class="detail-label">Amount</span>
						<span class="detail-value"
							>{successDetails.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span
						>
					</div>
					<div class="result-detail-row">
						<span class="detail-label">Transfer from</span>
						<span class="detail-value">{successDetails.from}</span>
					</div>
					<div class="result-detail-row">
						<span class="detail-label">Transfer to</span>
						<span class="detail-value">{successDetails.to}</span>
					</div>
					<div class="result-detail-row">
						<span class="detail-label">Transfer date</span>
						<span class="detail-value">{successDetails.date}</span>
					</div>
					<div class="result-detail-row">
						<span class="detail-label">Confirmation</span>
						<span class="detail-value">{successDetails.confirmation}</span>
					</div>
				</div>
				<div class="result-actions">
					<button type="button" class="result-button" on:click={closeSuccess}>Done</button>
				</div>
			</div>
		</div>
	</div>
{:else if transferState === 'error' && errorDetails}
	<div class="result-page" role="alert" aria-labelledby="error-title">
		<div class="result-wrapper">
			<div class="result-container error-container">
				<div class="result-header">
					<img src={transferFailIcon} alt="" class="result-icon" width="64" height="64" />
					<h2 id="error-title" class="result-title">Transfer Failed</h2>
					<p class="result-message">{errorDetails}</p>
				</div>
				<div class="result-actions">
					<button type="button" class="result-button" on:click={closeError}
						>Back to transfers</button
					>
				</div>
			</div>
		</div>
	</div>
{:else}
	<PageShell ariaLabel="Balance transfer" rightAriaLabel="Transfer summary and recent transfers">
		<svelte:fragment slot="left">
			{#if apiAvailable === false}
				<p class="api-warning" role="status">API is unavailable. Showing static demo data.</p>
			{/if}

			<div class="page-header">
				<h2 id="transfer-heading" class="page-title">Transfer between accounts</h2>
				<p id="transfer-desc" class="page-subtitle">
					Move money instantly between your accounts.
				</p>
			</div>
			<div class="form-card">
				<TransferForm
					{accounts}
					bind:fromAccountId={fromId}
					bind:toAccountId={toId}
					bind:amount={amountStr}
					submitDisabled={!canSubmit}
					errorMessage={formError}
					on:submit={handleSubmit}
				/>
			</div>
		</svelte:fragment>
		<svelte:fragment slot="right">
			<TransferSummary
				fromLabel={fromAccount ? accountNameOnly(fromAccount) : ''}
				toLabel={toAccount ? accountNameOnly(toAccount) : ''}
				amount={amountNum > 0 ? amountNum : null}
				fromBalance={fromAccount != null && amountNum > 0
					? fromAccount.balance - amountNum
					: (fromAccount?.balance ?? null)}
				toBalance={toAccount != null && amountNum > 0
					? toAccount.balance + amountNum
					: (toAccount?.balance ?? null)}
			/>
			<RecentTransfers items={recentTransferItems} />
		</svelte:fragment>
	</PageShell>
{/if}

<style>
	.result-page {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		background-color: var(--c-white);
	}

	@media (min-width: 768px) {
		.result-page {
			align-items: center;
		}
	}

	@media (max-width: 767px) {
		.result-page {
			align-items: flex-start;
			padding-top: 48px;
		}
	}

	.result-wrapper {
		width: 100%;
		max-width: 390px;
	}

	.result-container {
		background-color: var(--c-white);
		border-radius: var(--result-container-radius);
		padding: var(--result-padding);
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--result-gap);
		text-align: center;
		border: var(--border-size-thin) solid var(--result-border-ci);
	}

	@media (max-width: 767px) {
		.result-wrapper {
			width: 100%;
			max-width: none;
		}

		.result-container {
			border: none;
			width: 100%;
			padding: var(--result-padding) var(--result-padding-mobile-x);
		}
	}

	.result-header {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.result-header .result-icon {
		margin-bottom: var(--result-padding);
	}

	.result-header .result-title {
		margin: 0 0 var(--result-detail-gap);
	}

	.result-icon {
		display: block;
		flex-shrink: 0;
	}

	.result-title {
		font-family: var(--header-font);
		font-size: var(--result-title-fs);
		font-weight: var(--header-fw);
		color: var(--result-fg-ci);
	}

	.result-subtitle,
	.result-message {
		font-family: var(--text-font);
		font-size: var(--result-body-fs);
		font-weight: var(--fw-base);
		color: var(--result-fg-ci);
		margin: 0;
		line-height: 1.4;
	}

	.result-details {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		text-align: left;
	}

	.result-detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--s-4);
		padding-bottom: var(--result-detail-gap);
		margin-bottom: var(--result-detail-gap);
		border-bottom: var(--border-size-thin) solid var(--result-border-ci);
	}

	.result-detail-row:last-child {
		margin-bottom: 0;
	}

	.detail-label,
	.detail-value {
		font-family: var(--text-font);
		font-size: var(--result-body-fs);
		font-weight: var(--fw-base);
		color: var(--result-fg-ci);
		margin: 0;
	}

	.result-button {
		font-family: var(--text-font);
		font-size: var(--text-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--c-black);
		background-color: var(--c-white);
		border: var(--border-size-thin) solid var(--result-border-ci);
		border-radius: var(--radius);
		padding: 14.5px var(--s-6);
		cursor: pointer;
		width: 100%;
	}

	.result-button:hover {
		background-color: var(--c-gray-lighter);
	}

	.result-button:focus-visible {
		outline: 2px solid var(--primary-ci);
		outline-offset: 2px;
	}

	.api-warning {
		font-family: var(--text-font);
		font-size: var(--text-xs-fs);
		color: var(--c-red-dark);
		background-color: var(--c-red-lighter);
		border-radius: var(--radius);
		padding: var(--s-2);
		margin: 0 0 var(--s-3);
	}

	/* Local header stack for transfers page */
	.page-header {
		display: flex;
		flex-direction: column;
		gap: var(--s-2); /* 8px between title and subtitle */
	}

	.page-title {
		margin: 0;
	}

	.page-subtitle {
		margin: 0;
	}
</style>
