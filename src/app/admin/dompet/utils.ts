import { WalletApiResponse, Dompet } from "./types"

export function mapWalletApiToDompet(data: WalletApiResponse[]): Dompet[] {
    return data.map((w) => ({
        id: w.wallet_id,
        name: w.wallet_name,
        type: w.wallet_type,
        balance: w.balance,
    }))
}
