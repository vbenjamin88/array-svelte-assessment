<script lang="ts">
	import type { ActivityItem } from '$lib/types/accounts';
	import iconGroceryStore from '$lib/assets/shopping-cart.svg';
	import iconSalaryDeposit from '$lib/assets/briefcase.svg';
	import iconCoffeeShop from '$lib/assets/hot-beverage.svg';
	import iconTransferSavings from '$lib/assets/bank.svg';
	import iconInterestPayment from '$lib/assets/money-bag.svg';

	export let items: ActivityItem[] = [];

	const iconMap: Record<string, string> = {
		'Grocery Store': iconGroceryStore,
		'Salary Deposit': iconSalaryDeposit,
		'Coffee Shop': iconCoffeeShop,
		'Transfer to Savings': iconTransferSavings,
		'Interest Payment': iconInterestPayment
	};

	function getIcon(description: string): string {
		return iconMap[description] ?? iconGroceryStore;
	}
</script>

<section class="recent-activity" aria-labelledby="activity-heading">
	<h2 id="activity-heading" class="heading">Recent Activity</h2>
	<p class="subheading">Latest movements across all accounts</p>
	<ul class="list" role="list">
		{#each items as item (item.description + item.date)}
			<li class="item">
				<div class="item-icon" aria-hidden="true">
					<img src={getIcon(item.description)} alt="" class="icon-img" />
				</div>
				<div class="item-detail">
					<span class="detail-line1">{item.description}</span>
					<span class="detail-line2">
						<time datetime={item.date}>{item.date}</time>
						{item.account ? ' · ' + item.account : ''}
					</span>
				</div>
				<span class="item-amount" class:negative={item.amount < 0} aria-label="Amount">
					{item.amount >= 0 ? '+' : ''}${item.amount.toLocaleString('en-US', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.recent-activity {
		background-color: var(--c-gray-lighter);
		border-radius: var(--radius-xl); /* 12px */
		padding: var(--s-4); /* 16px */
		border: var(--border-size-thin) solid var(--border-ci); /* #D7DEE4 */
		box-shadow: none;
		height: fit-content;
	}

	.heading {
		font-family: var(--header-font);
		font-size: var(--text-fs); /* 16px */
		font-weight: var(--header-fw);
		color: var(--header-fg-ci);
		margin: 0 0 var(--s-2); /* 8px gap below heading */
	}

	.subheading {
		font-family: var(--text-font);
		font-size: var(--text-sm-fs); /* 14px */
		font-weight: var(--fw-base);
		line-height: 100%;
		letter-spacing: 0;
		color: var(--text-light-fg-ci); /* #6B6C6F */
		margin: 0 0 var(--s-6); /* 24px gap below subheading */
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-6); /* 24px between items */
	}

	.item {
		display: flex;
		align-items: flex-start;
		gap: var(--s-2); /* 8px between icon and detail */
	}

	.item-icon {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: var(--c-gray-light);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.icon-img {
		width: 12px;
		height: 12px;
		object-fit: contain;
	}

	.item-detail {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-2); /* 8px between line1 and line2 */
	}

	.detail-line1 {
		font-family: var(--text-font);
		font-size: var(--text-sm-fs); /* 14px */
		color: var(--text-secondary-fg-ci); /* #3E3F42 */
	}

	.detail-line2 {
		font-family: var(--text-font);
		font-size: var(--text-xs-fs); /* 12px */
		color: var(--text-light-fg-ci); /* #6B6C6F */
	}

	.detail-line2 time {
		text-decoration: none;
	}

	.item-amount {
		flex-shrink: 0;
		font-family: var(--number-font);
		font-weight: var(--fw-medium);
		font-size: var(--text-sm-fs); /* 14px */
		color: var(--text-secondary-fg-ci); /* #3E3F42 */
		margin-left: auto;
	}

	.item-amount.negative {
		color: var(--c-red-dark);
	}
</style>
