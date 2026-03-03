import { describe, it, expect } from 'vitest';
import { accountLabel, accountNameOnly, maskAccountNumber } from './accounts';
import type { AccountSummary } from '$lib/types/accounts';

function mockAccount(overrides: Partial<AccountSummary> = {}): AccountSummary {
	return {
		account_id: '1',
		account_holder_name: 'Account Holder',
		account_number: '1234568821',
		account_type: 'Checking',
		account_status: 'Active',
		balance: 2450.32,
		currency: 'USD',
		...overrides
	};
}

// Display label formatting
describe('accountLabel', () => {
	it('returns label with suffix for Checking', () => {
		const account = mockAccount({ account_type: 'Checking', account_number: '1234568821' });
		expect(accountLabel(account)).toBe('Everyday Checking...1234568821');
	});

	it('returns label with suffix for Savings', () => {
		const account = mockAccount({ account_type: 'Savings', account_number: '1234561284' });
		expect(accountLabel(account)).toBe('High-Yield Savings...1234561284');
	});

	it('returns label with suffix for Credit', () => {
		const account = mockAccount({ account_type: 'Credit', account_number: '1234565678' });
		expect(accountLabel(account)).toBe('Rewards Credit...1234565678');
	});
});

describe('accountNameOnly', () => {
	it('returns display name for each account type', () => {
		expect(accountNameOnly(mockAccount({ account_type: 'Checking' }))).toBe('Everyday Checking');
		expect(accountNameOnly(mockAccount({ account_type: 'Savings' }))).toBe('High-Yield Savings');
		expect(accountNameOnly(mockAccount({ account_type: 'Credit' }))).toBe('Rewards Credit');
	});

	it('returns type as-is for unknown types', () => {
		expect(accountNameOnly(mockAccount({ account_type: 'Other' }))).toBe('Other');
	});
});

describe('maskAccountNumber', () => {
	it('returns all digits when there is no dash', () => {
		expect(maskAccountNumber('1234568821')).toBe('1234568821');
	});

	it('handles short numbers', () => {
		expect(maskAccountNumber('1234')).toBe('1234');
	});

	it('returns digits after the last dash', () => {
		expect(maskAccountNumber('123456-00021')).toBe('00021');
	});

	it('strips non-digits after the dash', () => {
		expect(maskAccountNumber('****-00021')).toBe('00021');
	});
});
