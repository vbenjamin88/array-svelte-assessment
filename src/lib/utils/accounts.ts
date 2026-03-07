import type { AccountSummary } from '$lib/types/accounts';

/** Get display label for account (e.g. "Everyday Checking...8821") */
export function accountLabel(account: AccountSummary): string {
	const typeLabel = accountDisplayName(account.account_type);
	const suffix = account.account_number.slice(-4);
	return `${typeLabel}...${suffix}`;
}

/** Get account name only (e.g. "Everyday Checking") */
export function accountNameOnly(account: AccountSummary): string {
	return accountDisplayName(account.account_type);
}

/** Map account type to display name */
function accountDisplayName(type: string): string {
	switch (type) {
		case 'Checking':
			return 'Everyday Checking';
		case 'Savings':
			return 'High-Yield Savings';
		case 'Credit':
			return 'Rewards Credit';
		default:
			return type;
	}
}

/** Mask account number to last 4 digits */
export function maskAccountNumber(num: string): string {
	return num.slice(-4);
}
