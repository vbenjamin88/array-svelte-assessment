import type { PageServerLoad } from './$types';
import {
	fetchAccounts,
	fetchRecentActivity,
	getMockAccounts,
	getMockRecentActivity
} from '$lib/server/northwind';

export const load: PageServerLoad = async ({ fetch }) => {
	let accounts;
	let recentActivity;
	let apiAvailable = true;

	try {
		[accounts, recentActivity] = await Promise.all([
			fetchAccounts(fetch),
			fetchRecentActivity(fetch)
		]);
	} catch (error) {
		console.error('Falling back to mock data for accounts page:', error);
		apiAvailable = false;
		accounts = getMockAccounts();
		recentActivity = getMockRecentActivity();
	}

	return {
		accounts,
		recentActivity,
		apiAvailable
	};
};
