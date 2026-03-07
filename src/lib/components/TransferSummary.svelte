<script lang="ts">
	export let fromLabel = '';
	export let toLabel = '';
	export let amount: number | null = null;
	export let fromBalance: number | null = null;
	export let toBalance: number | null = null;
</script>

<section class="summary" aria-labelledby="summary-heading">
	<h2 id="summary-heading" class="heading">Transfer summary</h2>
	<p class="subheading">A quick view of how this transfer affects your balances.</p>

	<div class="from-to-section">
		<div class="col from-col">
			<p class="from-to-title">
				{amount != null && amount > 0
					? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `
					: ''}From
			</p>
			<div class="transaction-detail">
				{#if fromLabel}
					<span class="detail-line1">{fromLabel}</span>
					<span class="detail-line2">
						{fromBalance != null
							? `New balance · $${fromBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
							: ''}
					</span>
				{:else}
					<span class="detail-line1">-</span>
				{/if}
			</div>
		</div>
		<div class="col to-col">
			<p class="from-to-title">
				{amount != null && amount > 0
					? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} `
					: ''}To
			</p>
			<div class="transaction-detail">
				{#if toLabel}
					<span class="detail-line1">{toLabel}</span>
					<span class="detail-line2">
						{toBalance != null
							? `New balance · $${toBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
							: ''}
					</span>
				{:else}
					<span class="detail-line1">-</span>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.summary {
		background-color: var(--c-white);
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

	.from-to-section {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-2);
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}

	.from-to-title {
		font-family: var(--text-font);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-base);
		color: var(--text-light-fg-ci);
		margin: 0;
	}

	.transaction-detail {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
	}

	.detail-line1 {
		font-family: var(--text-font);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-base);
		color: var(--text-fg-ci);
	}

	.detail-line2 {
		font-family: var(--text-font);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-base);
		color: var(--text-light-fg-ci);
	}
</style>
