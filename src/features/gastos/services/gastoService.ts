import { BudgetFormValues, InsertLimiteGasto, SelectLimiteGasto } from "../types/types";
import { gastoRepository, IGastoRepository } from "./gastoRepository";

export class GastoService {
    constructor (
        private gastoRepository: IGastoRepository,
    ){}

    async createExpenseLimit(expense: BudgetFormValues, userId: string) {
        const data = {
            ...expense,
            userId,
        }
        try {
            await this.gastoRepository.insertExpenseLimit(data);
            return { success: true, message: 'Se ha creado nuevo limite de gasto' }
        } catch (error) {
            return { success: false, message: 'Ha ocurrido un error' }
        }
    }

    async getUsersExpenseLimits(userId: string) {
        try {
            const budgets= await this.gastoRepository.selectUserExpenseLimits(userId);
            return { success: true, message:'', budgets } 
        } catch (error) {
            return { success: false, message:'Error al obtener la información', budgets: [] } 
        }
    }

    async deleteUserExpenseLimit(userId: string, limitId: string) {
        try {
            await this.gastoRepository.deleteExpenseLimitUser(userId, limitId);
            return { success: true, message:'El límite de gasto se ha eliminado correctamente' } 
        } catch (error) {
            return { success: false, message:'Error al eliminar el Limite de Gasto' } 
        }
    }

    async updateExpenseLimit(userId: string, limit: BudgetFormValues, currentLimitId: string) {
        const data = {
            ...limit,
            userId,
        }
        try {
            await this.gastoRepository.setExpenseLimit(userId, data, currentLimitId);
            return { success: true, message:'El límite de gasto se ha actualizado ' }        
        } catch (error) {
            return { success: false, message:'El límite de gasto no se pudo actualizar ' }
        }
    };

    async expenseLimit(userId: string, limitId: string) {
        try {
            const expenseLimit = await this.gastoRepository.selectExpenseLimit(userId, limitId);
            return { success: true, message:'El límite de gasto se ha actualizado ', expenseLimit }        
        } catch (error) {
            return { success: false, message:'El límite de gasto no se pudo actualizar ', expenseLimit: {} as SelectLimiteGasto }
        }
    }

}

export const gastoService = new GastoService(gastoRepository);