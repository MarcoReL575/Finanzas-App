import { BudgetFormValues } from "../types/types";
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

}

export const gastoService = new GastoService(gastoRepository);