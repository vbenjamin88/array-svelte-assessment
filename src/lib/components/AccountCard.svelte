<script lang="ts">
	export let name: string;
	export let accountNumberSuffix: string;
	export let balance: number;
	export let isActive = true;
	export let typeLabel: string;
</script>

<article
	class="card"
	class:inactive={!isActive}
	aria-label="{name} account ending in {accountNumberSuffix}"
>
	<div class="card-body">
		<div class="card-row">
			<h3 class="account-name">{name}</h3>
			<p class="balance" class:negative={balance < 0} aria-label="Balance">
				{balance < 0 ? '-' : ''}${Math.abs(balance).toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
			</p>
		</div>
		<div class="card-row">
			<div class="account-meta">
				<span class="account-suffix">**** {accountNumberSuffix}</span>
				<span class="account-type-badge">{typeLabel}</span>
			</div>
			<span class="status" aria-label="Account status">{isActive ? 'Available' : 'Inactive'}</span>
		</div>
	</div>
</article>

<style>
	.card {
		background-color: var(--c-white);
		border-radius: var(--radius-lg);
		padding: var(--s-4); /* 16px */
		border: var(--border-size-thin) solid var(--border-ci-light);
		box-shadow: var(--shadow-sm);
	}

	.card.inactive {
		opacity: 0.7;
		background-color: var(--c-gray-lightest);
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: var(--s-2); /* 8px between the two text rows */
	}

	.card-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.account-name {
		font-family: var(--text-font);
		font-size: var(--text-fs); /* 16px */
		font-weight: var(--fw-base);
		color: var(--text-fg-ci);
		margin: 0;
	}

	.account-suffix {
		font-family: var(--text-font);
		font-size: var(--text-sm-fs); /* 14px */
		font-weight: var(--fw-base);
		line-height: 100%;
		letter-spacing: 0;
		color: var(--text-secondary-fg-ci);
	}

	.account-meta {
		display: flex;
		align-items: center;
		gap: var(--s-2); /* 8px between masked number and badge */
	}

	.account-type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--s-2); /* 8px */
		border-radius: var(--radius-md); /* 6px */
		background-color: var(--badge-bg-ci);
		font-family: var(--text-font);
		font-size: var(--text-sm-fs); /* 14px */
		font-weight: var(--fw-medium);
		color: var(--c-black);
		letter-spacing: -0.2px;
	}

	.balance {
		font-family: var(--number-font);
		font-size: var(--text-fs); /* 16px */
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
		margin: 0;
		text-align: right;
	}

	.balance.negative {
		color: var(--c-red-dark);
	}

	.status {
		font-size: var(--text-sm-fs); /* 14px */
		color: var(--text-light-fg-ci);
		text-align: right;
	}
</style>
