import type { AccountSummary } from '$lib/types/accounts';

/** Get display label for account (e.g. "Everyday Checking...8821") */
export function accountLabel(account: AccountSummary): string {
	const typeLabel = accountDisplayName(account.account_type);
	const suffix = maskAccountNumber(account.account_number);
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

/** Mask account number for label suffix based on Northwind format */
export function maskAccountNumber(num: string): string {
	// If there is a dash, show everything after the last dash (with non-digits stripped),
	// e.g. "****-00021" -> "00021".
	const dashIndex = num.lastIndexOf('-');
	if (dashIndex !== -1 && dashIndex < num.length - 1) {
		return num.slice(dashIndex + 1).replace(/\D/g, '');
	}

	// Otherwise, show all digits in the value (no fixed length).
	return num.replace(/\D/g, '');
}
