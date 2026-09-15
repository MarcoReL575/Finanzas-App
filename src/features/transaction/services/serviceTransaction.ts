import { InsertTransaction } from "../types/types";
import { IransactionRepository, transactionRepository } from "./repositoryTransaction";

class TransactionService {
    constructor(
        private transactionRepository: IransactionRepository
    ){}

    async addTransaction(transaction: InsertTransaction, userId: string) {
        try {
            await this.transactionRepository.insertTransaction(transaction, userId);
            return { success: true, message: 'Transacción agregada' }
        } catch (error) {
            return { success: false, message: 'Error al crear la transacción' }
        }
    }

    async getTransactionsByUser(userId: string) {
        try {
            const transactions = await this.transactionRepository.selectTransactionsUser(userId);
            return { success: true, message: '',  transactions}
        } catch (error) {
            return { success: false, message: 'Error al obtener los datos', transactions: [] }
        }
    }
}

export const transactionService = new TransactionService(transactionRepository)