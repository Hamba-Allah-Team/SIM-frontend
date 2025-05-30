export type TransactionCategory = {
    id: string;
    name: string;
    type: 'income' | 'expense';
    mosque_id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};
