import type { PageServerLoad } from './$types';
import {
	fetchAccounts,
	fetchRecentActivity,
	getMockAccounts,
	getMockRecentActivity
} from '$lib/server/northwind';

export const load: PageServerLoad = async ({ fetch }) => {
	let accounts;
	let recentTransfers;
	let apiAvailable = true;

	try {
		const [apiAccounts, recentActivity] = await Promise.all([
			fetchAccounts(fetch),
			fetchRecentActivity(fetch)
		]);
		accounts = apiAccounts;
		recentTransfers = recentActivity;
	} catch (error) {
		console.error('Falling back to mock data for transfers page:', error);
		apiAvailable = false;
		accounts = getMockAccounts();
		recentTransfers = getMockRecentActivity();
	}

	return {
		accounts,
		recentTransfers,
		apiAvailable
	};
};
