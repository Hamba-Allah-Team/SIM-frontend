export interface TransactionCategory {
    id: number
    name: string
    type: "income" | "expense"
    description: string | null
    mosque_id: number
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface TransactionCategoryResponse {
    category_id: number;
    category_name: string;
    category_type: "income" | "expense";
    description: string | null;
    mosque_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface CreateTransactionCategoryPayload {
    mosque_id: number;
    category_name: string;
    category_type: "income" | "expense";
    description?: string | null;
}
