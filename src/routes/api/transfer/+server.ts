import type { RequestHandler } from '@sveltejs/kit';
import { fetchAccounts, initiateInternalTransfer } from '$lib/server/northwind';

export const POST: RequestHandler = async ({ request, fetch }) => {
	try {
		const { fromId, toId, amount } = await request.json();

		if (!fromId || !toId || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
			return new Response(JSON.stringify({ ok: false, error: 'Invalid transfer payload.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const accounts = await fetchAccounts(fetch);
		const from = accounts.find((a) => a.account_id === fromId);
		const to = accounts.find((a) => a.account_id === toId);

		if (!from || !to) {
			return new Response(JSON.stringify({ ok: false, error: 'Account not found.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const transfer = await initiateInternalTransfer(from, to, amount, fetch);

		return new Response(JSON.stringify({ ok: true, transfer }), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Unexpected error while initiating transfer.';

		return new Response(JSON.stringify({ ok: false, error: message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
