<script lang="ts">
	import iconTransferSavings from '$lib/assets/bank.svg';

	export interface TransferItem {
		description: string;
		amount: number;
		date: string;
		/** Source/account for second line (e.g. "From Everyday Checking") */
		account?: string;
	}

	export let items: TransferItem[] = [];
</script>

<section class="recent-transfers" aria-labelledby="transfers-heading">
	<h2 id="transfers-heading" class="heading">Recent transfers</h2>
	<p class="subheading">Quick reference of your latest internal transfers.</p>
	<ul class="list" role="list">
		{#each items as item (item.description + item.date)}
			<li class="item">
				<div class="item-icon" aria-hidden="true">
					<img src={iconTransferSavings} alt="" class="icon-img" />
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
	.recent-transfers {
		background-color: var(--c-gray-lighter);
		border-radius: var(--radius-xl);
		padding: var(--s-4);
		border: var(--border-size-thin) solid var(--border-ci);
		box-shadow: var(--shadow-none);
		height: fit-content;
	}

	.heading {
		font-family: var(--header-font);
		font-size: var(--text-fs);
		font-weight: var(--header-fw);
		color: var(--text-secondary-fg-ci);
		margin: 0 0 var(--s-2);
	}

	.subheading {
		font-family: var(--text-font);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-base);
		line-height: 100%;
		letter-spacing: 0;
		color: var(--text-light-fg-ci);
		margin: 0 0 var(--s-6);
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
	}

	.item {
		display: flex;
		align-items: flex-start;
		gap: var(--s-2);
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
		font-size: var(--text-sm-fs);
		color: var(--text-secondary-fg-ci);
	}

	.detail-line2 {
		font-family: var(--text-font);
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
	}

	.detail-line2 time {
		text-decoration: none;
	}

	.item-amount {
		flex-shrink: 0;
		font-family: var(--number-font);
		font-weight: var(--fw-medium);
		font-size: var(--text-sm-fs);
		color: var(--text-secondary-fg-ci);
		margin-left: auto;
	}

	.item-amount.negative {
		color: var(--c-red-dark);
	}
</style>
