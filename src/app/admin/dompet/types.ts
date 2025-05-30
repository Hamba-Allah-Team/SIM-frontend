export interface WalletApiResponse {
    wallet_id: number
    mosque_id: number
    wallet_type: string
    wallet_name: string
    balance: number
}

export interface Dompet {
    id: number
    type: string
    name: string
    balance: number
}
