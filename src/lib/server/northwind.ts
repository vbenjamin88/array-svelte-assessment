import type { AccountSummary, ActivityItem } from '$lib/types/accounts';
import { NORTHWIND_API_KEY, NORTHWIND_BASE_URL } from '$env/static/private';

const DEFAULT_BASE_URL = 'https://northwind.dev.array.io';

const API_KEY = NORTHWIND_API_KEY;
const BASE_URL = NORTHWIND_BASE_URL || DEFAULT_BASE_URL;

type FetchLike = typeof fetch;

interface AccountListResponse {
	accounts: AccountSummary[];
}

interface TransferAccountDetails {
	account_holder_name?: string;
	institution_name?: string;
}

interface TransferSummaryApi {
	amount?: number;
	currency?: string;
	description?: string;
	direction?: 'INBOUND' | 'OUTBOUND';
	initiated_date?: string;
	completed_date?: string;
	source_account?: TransferAccountDetails;
}

interface TransferListResponse {
	transfers: TransferSummaryApi[];
}

export function getMockAccounts(): AccountSummary[] {
	return [
		{
			account_id: '1',
			account_holder_name: 'Account Holder',
			account_number: '****3210',
			account_type: 'Checking',
			account_status: 'Active',
			balance: 2450.32,
			currency: 'USD'
		},
		{
			account_id: '2',
			account_holder_name: 'Account Holder',
			account_number: '****1234',
			account_type: 'Savings',
			account_status: 'Active',
			balance: 10450.0,
			currency: 'USD'
		},
		{
			account_id: '3',
			account_holder_name: 'Account Holder',
			account_number: '****5678',
			account_type: 'Credit',
			account_status: 'Active',
			balance: -630.12,
			currency: 'USD'
		}
	];
}

export function getMockRecentActivity(): ActivityItem[] {
	return [
		{
			description: 'Grocery Store',
			amount: -82.45,
			date: 'Dec 14',
			account: 'Everyday Checking'
		},
		{
			description: 'Salary Deposit',
			amount: 2800.0,
			date: 'Dec 13',
			account: 'Everyday Checking'
		},
		{ description: 'Coffee Shop', amount: -5.75, date: 'Dec 12', account: 'Rewards Credit' },
		{
			description: 'Interest Payment',
			amount: 5.24,
			date: 'Dec 1',
			account: 'High-Yield Savings'
		},
		{
			description: 'Transfer to Savings',
			amount: -250.0,
			date: 'Dec 10',
			account: 'Internal transfer'
		}
	];
}

async function apiFetch<T>(path: string, fetchFn: FetchLike, init: RequestInit = {}): Promise<T> {
	// When no API key is configured (e.g. in CI), fall back to mock data
	if (!API_KEY) {
		throw new Error('NORTHWIND_API_KEY is not configured');
	}

	const url = `${BASE_URL}${path}`;
	const response = await fetchFn(url, {
		...init,
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'Content-Type': 'application/json',
			...(init.headers ?? {})
		}
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Northwind API error ${response.status}: ${text}`);
	}

	return (await response.json()) as T;
}

export async function fetchAccounts(fetchFn: FetchLike): Promise<AccountSummary[]> {
	const data = await apiFetch<AccountListResponse>('/external/accounts?limit=50&offset=0', fetchFn);
	return data.accounts ?? [];
}

export async function fetchRecentActivity(fetchFn: FetchLike): Promise<ActivityItem[]> {
	const data = await apiFetch<TransferListResponse>(
		'/external/transfers?page=1&per_page=20',
		fetchFn
	);
	const transfers = data.transfers ?? [];

	const formatDate = (iso?: string): string => {
		if (!iso) return '';
		const d = new Date(iso);
		return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	};

	const items: ActivityItem[] = transfers.map((t) => {
		const baseAmount = t.amount ?? 0;
		const amount = t.direction === 'OUTBOUND' ? -baseAmount : baseAmount;

		return {
			description: t.description || 'Transfer',
			amount,
			date: formatDate(t.completed_date || t.initiated_date),
			account: t.source_account?.institution_name || t.source_account?.account_holder_name
		};
	});

	return items;
}

type Direction = 'INBOUND' | 'OUTBOUND';

interface ExternalAccountPayload {
	account_holder_name: string;
	account_number: string;
	institution_name: string;
	routing_number: string;
}

interface TransferRequestPayload {
	amount: number;
	currency: string;
	description: string;
	destination_account: ExternalAccountPayload;
	direction: Direction;
	reference_number: string;
	scheduled_date?: string;
	source_account: ExternalAccountPayload;
	transfer_type: string;
}

interface ValidationIssue {
	message?: string;
	field?: string;
	severity?: string;
}

interface ValidationResult {
	valid?: boolean;
	issues?: ValidationIssue[];
}

interface ValidationResponse {
	validation?: ValidationResult;
}

interface TransferStatusResponse {
	amount?: number;
	currency?: string;
	description?: string;
	status?: string;
	transfer_id?: string;
	reference_number?: string;
}

function toExternalAccountPayload(account: AccountSummary): ExternalAccountPayload {
	return {
		account_holder_name: account.account_holder_name,
		account_number: account.account_number,
		institution_name: 'Northwind Bank',
		routing_number: account.routing_number ?? '002772909'
	};
}

export interface InitiatedTransfer {
	status: string;
	transfer_id?: string;
	reference_number?: string;
	amount: number;
	currency: string;
	description: string;
}

export async function initiateInternalTransfer(
	from: AccountSummary,
	to: AccountSummary,
	amount: number,
	fetchFn: FetchLike
): Promise<InitiatedTransfer> {
	const payload: TransferRequestPayload = {
		amount,
		currency: from.currency ?? 'USD',
		description: `Internal transfer from ${from.account_type} to ${to.account_type}`,
		destination_account: toExternalAccountPayload(to),
		direction: 'OUTBOUND',
		reference_number: `UI-${Date.now()}`,
		source_account: toExternalAccountPayload(from),
		transfer_type: 'ACH'
	};

	// First validate without creating
	const validation = await apiFetch<ValidationResponse>('/external/transfers/validate', fetchFn, {
		method: 'POST',
		body: JSON.stringify(payload)
	});

	if (validation.validation && validation.validation.valid === false) {
		const firstIssue = validation.validation.issues?.[0];
		throw new Error(firstIssue?.message || 'Transfer validation failed');
	}

	// Then initiate the transfer
	const status = await apiFetch<TransferStatusResponse>('/external/transfers/initiate', fetchFn, {
		method: 'POST',
		body: JSON.stringify(payload)
	});

	return {
		status: status.status ?? 'PENDING',
		transfer_id: status.transfer_id,
		reference_number: status.reference_number,
		amount: status.amount ?? amount,
		currency: status.currency ?? payload.currency,
		description: status.description ?? payload.description
	};
}
