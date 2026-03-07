<script lang="ts">
	import { accounts } from '$lib/stores/accounts';
	import AccountCard from '$lib/components/AccountCard.svelte';
	import RecentActivity from '$lib/components/RecentActivity.svelte';
	import PageShell from '$lib/components/PageShell.svelte';
	import type { ActivityItem } from '$lib/types/accounts';
	import { maskAccountNumber, accountNameOnly } from '$lib/utils/accounts';

	const recentActivity: ActivityItem[] = [
		{ description: 'Grocery Store', amount: -82.45, date: 'Dec 14', account: 'Everyday Checking' },
		{ description: 'Salary Deposit', amount: 2800.0, date: 'Dec 13', account: 'Everyday Checking' },
		{ description: 'Coffee Shop', amount: -5.75, date: 'Dec 12', account: 'Rewards Credit' },
		{ description: 'Interest Payment', amount: 5.24, date: 'Dec 1', account: 'High-Yield Savings' },
		{
			description: 'Transfer to Savings',
			amount: -250.0,
			date: 'Dec 10',
			account: 'Internal transfer'
		}
	];

	$: totalBalance = $accounts.reduce((sum, a) => sum + a.balance, 0);
	$: accountCount = $accounts.length;

	function isActive(status: string): boolean {
		return status?.toLowerCase() === 'active';
	}
</script>

<PageShell ariaLabel="Accounts overview" rightAriaLabel="Recent activity">
	<svelte:fragment slot="left">
		<section class="total-section" aria-labelledby="total-heading">
			<h2 id="total-heading" class="total-label">Total balance</h2>
			<p class="total-amount" aria-live="polite">
				${totalBalance.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
			</p>
			<p class="total-subtitle">Across {accountCount} accounts</p>
		</section>

		<section class="accounts-section" aria-labelledby="accounts-heading">
			<h2 id="accounts-heading" class="section-heading">Your accounts</h2>
			<ul class="account-list" role="list">
				{#each $accounts as account (account.account_id)}
					<li>
						<AccountCard
							name={accountNameOnly(account)}
							accountNumberSuffix={maskAccountNumber(account.account_number)}
							balance={account.balance}
							isActive={isActive(account.account_status)}
							typeLabel={account.account_type}
						/>
					</li>
				{/each}
			</ul>
		</section>
	</svelte:fragment>
	<svelte:fragment slot="right">
		<RecentActivity items={recentActivity} />
	</svelte:fragment>
</PageShell>

<style>
	:global(.left-col) {
		gap: var(--s-12);
	}

	.total-section {
		display: flex;
		flex-direction: column;
		gap: var(--s-2); /* 8px */
		background-color: var(--primary-ci);
		border-radius: var(--radius-xl);
		padding: var(--s-4); /* 16px */
		border: none;
		box-shadow: none;
	}

	.total-label {
		font-family: var(--text-font);
		font-size: 14px; /* Figma: 14px Regular */
		font-weight: var(--fw-base); /* 400 */
		line-height: 1;
		letter-spacing: 0;
		color: var(--c-white);
		margin: 0;
	}

	.total-amount {
		font-family: var(--number-font);
		font-size: 32px; /* Figma: 32px Bold */
		font-weight: var(--fw-bold); /* 700 */
		line-height: 1;
		letter-spacing: 0;
		color: var(--c-white);
		margin: 0;
	}

	.total-subtitle {
		font-family: var(--text-font);
		font-size: 13px; /* Figma: 13px Regular */
		font-weight: var(--fw-base);
		line-height: 1;
		letter-spacing: 0;
		color: var(--c-white);
		margin: 0;
	}

	.section-heading {
		margin: 0 0 var(--s-6);
	}

	.account-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}
</style>
