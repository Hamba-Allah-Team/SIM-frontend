// app/admin/dashboard/types.ts

export interface SummaryData {
    total_income: number;
    total_expense: number;
    net_balance: number;
    wallet_balances: {
        wallet_id: number;
        wallet_name: string;
        wallet_type: string;
        balance: number;
    }[];
}

export interface Transaction {
    transaction_id: number;
    date: string;
    type: 'income' | 'expense' | 'transfer_in' | 'transfer_out';
    amount: number;
    category: string | null;
    wallet: string | null;
    description: string;
}

export interface TopCategory {
    category_id: number;
    category_name: string;
    total_amount: number;
}
