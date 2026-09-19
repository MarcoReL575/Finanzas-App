import { InsertFormTransaction, InsertTransaction, PaginatedResult, PaginationParams, SelectTransaction } from "../types/types";
import { IransactionRepository, transactionRepository } from "./repositoryTransaction";

class TransactionService {
    constructor(
        private transactionRepository: IransactionRepository
    ){}

    async addTransaction(transaction: InsertFormTransaction, userId: string) {
        const transactionData = {
            ...transaction,
            createdAt: new Date(transaction.createdAt),
            userId: userId
        }
        try {
            await this.transactionRepository.insertTransaction(transactionData);
            return { success: true, message: 'Transacción agregada' }
        } catch (error) {
            return { success: false, message: 'Error al crear la transacción' }
        }
    }

    async getTransactionsByUser(userId: string, { page, limit }: PaginationParams) {
        try {
            const transactions = await this.transactionRepository.selectTransactionsUser(userId, { page: page, limit });
            return transactions
        } catch (error) {
            return {} as PaginatedResult<SelectTransaction>
        }
    }

    async getSingleTransactionById(userId: string, transactionId: number) {
        try {
            const transaction = await this.transactionRepository.selectSingleTransaction(userId, transactionId);
            return { success: false, message: 'El usuario no se ha registrado', transaction }
        } catch (error) {
            return { success: false, message: 'Error al obtener el gasto', transaction: {} as SelectTransaction }
        }
    }
}

export const transactionService = new TransactionService(transactionRepository)