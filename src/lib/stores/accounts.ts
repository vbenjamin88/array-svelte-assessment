import { writable } from 'svelte/store';
import type { AccountSummary } from '$lib/types/accounts';

/** Shared accounts data - single source of truth (Svelte store) */
const mockAccounts: AccountSummary[] = [
	{
		account_id: '1',
		account_holder_name: 'Account Holder',
		account_number: '1234568821',
		account_type: 'Checking',
		account_status: 'Active',
		balance: 2450.32,
		currency: 'USD'
	},
	{
		account_id: '2',
		account_holder_name: 'Account Holder',
		account_number: '1234561284',
		account_type: 'Savings',
		account_status: 'Active',
		balance: 10450.0,
		currency: 'USD'
	},
	{
		account_id: '3',
		account_holder_name: 'Account Holder',
		account_number: '1234565678',
		account_type: 'Credit',
		account_status: 'Active',
		balance: -630.12,
		currency: 'USD'
	}
];

export const accounts = writable<AccountSummary[]>(mockAccounts);
