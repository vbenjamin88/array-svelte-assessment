/** Account summary for display (matches NorthWind API AccountSummary shape) */
export interface AccountSummary {
	account_id: string;
	account_holder_name: string;
	account_number: string;
	account_type: string;
	account_status: string;
	balance: number;
	currency: string;
	opened_date?: string;
	routing_number?: string;
}

/** Activity/transaction item for Recent Activity list */
export interface ActivityItem {
	description: string;
	amount: number;
	date: string;
	/** Account or status for second line (e.g. "Everyday Checking") */
	account?: string;
}
