import { formatCurrency } from "@/src/shared/helper/formatCurrency";
import { InsertFormTransaction, InsertTransaction, PaginatedResult, PaginationParams, SelectTransaction, UserBalance } from "../types/types";
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
            console.log({error})
            return { success: false, message: 'Error al crear la transacción' }
        }
    }

    async getTransactionsUser(userId: string) {
        try {
            const transactions = await this.transactionRepository.selectTransactionsByUser(userId);
            return { success: true, message: '', transactions }
        } catch (error) {
            return { success: false, message: 'Hubor un error al obteenr los datos', transactions: [] }
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
            return { success: true, message: 'El usuario no se ha registrado', transaction }
        } catch (error) {
            return { success: false, message: 'Error al obtener el gasto', transaction: {} as SelectTransaction }
        }
    }

    async deleteTansaction(userId: string, transactionId: number) {
        try {
            await this.transactionRepository.deleteSingleTransaction(userId, transactionId);
            return { success: true, message: 'La transacción se ha eliminado' }
        } catch (error) {
            return { success: false, message: 'Error al eliminar la transacción' }
        }
    }

    async updateTransaction(userId: string, transaction: InsertFormTransaction) {
        const transactionData = {
            ...transaction,
            createdAt: new Date(transaction.createdAt),
            userId: userId
        }
        try {
            await this.transactionRepository.updateSingleTransaction(userId, transactionData, transaction.id!);
            return { success: true, message: 'La transacción se ha actualizado' }
        } catch (error) {
            console.log(error)
            return { success: false, message: 'Hubo un error al actualizar' }
        }
    }

    async getBalanceSummary(userId: string) {
        try {
            const balance = await this.transactionRepository.getUserBalance(userId);
            return {
                success: true,
                message: '',
                data: {
                    totalIngresos: balance.totalIngresos,
                    totalGastos: balance.totalGastos,
                    balanceTotal: balance.balanceTotal,
                }
            };
        } catch (error) {
            return { success: false, message: 'No se pudo obtener el balance', data: {} as UserBalance };
        }
    }
}

export const transactionService = new TransactionService(transactionRepository)