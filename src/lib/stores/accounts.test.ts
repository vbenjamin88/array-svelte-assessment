import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { accounts } from './accounts';

describe('accounts store', () => {
	it('has initial mock accounts', () => {
		const value = get(accounts);
		expect(value).toHaveLength(3);
		expect(value[0].account_type).toBe('Checking');
		expect(value[1].account_type).toBe('Savings');
		expect(value[2].account_type).toBe('Credit');
	});

	it('accounts have required fields', () => {
		const value = get(accounts);
		value.forEach((account) => {
			expect(account).toHaveProperty('account_id');
			expect(account).toHaveProperty('account_type');
			expect(account).toHaveProperty('balance');
			expect(account).toHaveProperty('account_number');
		});
	});
});
