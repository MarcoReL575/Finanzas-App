import { beforeEach, describe, expect, test, vi } from "vitest";
import { InsertLimiteGasto, SelectLimiteGasto } from "../types/types";
import { gastoRepository } from "./gastoRepository";
import { db } from "@/src/db";
import { budgets } from "@/src/db/schema";
import { eq } from "drizzle-orm";

const mocks = vi.hoisted(() => ({ 
    insert: vi.fn(), 
    values: vi.fn(), 
    select: vi.fn(), 
    from: vi.fn(), 
    where: vi.fn(), 
    eq: vi.fn() 
}));

vi.mock('@/src/db', () => ({ 
    db: { 
        insert: mocks.insert, 
        select: mocks.select 
    } 
}));

vi.mock('@/src/db/schema', () => ({ 
    budgets: { 
        userId: 'budgets.userId'
    }
}));

vi.mock('drizzle-orm', () => ({ 
    eq: mocks.eq 
}));

const mockExpense = { 
    userId: 'user-123', 
    category: 'alimentacion', 
    monto: 50000, 
    month: 10, 
    year: 2026, 
} as InsertLimiteGasto;

const mockBudgets = [ 
    { 
        id: 'budget-1', 
        userId: 'user-123', 
        category: 'alimentacion', 
        monto: 50000, 
        month: 10, 
        year: 2026 
    }, 
    { 
        id: 'budget-2', 
        userId: 'user-123', 
        category: 'transporte', 
        monto: 20000, 
        month: 10, 
        year: 2026, 
    }, 
] as SelectLimiteGasto[];

describe('GastoRepository Test', ()=> {

    beforeEach(() => { 
        vi.clearAllMocks(); 
        
        // Configurar la cadena de inserción 
        mocks.insert.mockReturnValue({ values: mocks.values, }); 
        mocks.values.mockResolvedValue(undefined); 
        
        // Configurar la cadena de consulta 
        mocks.select.mockReturnValue({ from: mocks.from, }); 
        mocks.from.mockReturnValue({ where: mocks.where, }); 
        mocks.where.mockResolvedValue(mockBudgets); 
        
        // Simular el operador eq de Drizzle 
        mocks.eq.mockReturnValue('mock-user-filter'); 
    });

    describe('insertExpenseLimit', ()=> {
        test('debe insertar un límite de gasto en la base de datos', async()=> {
            await gastoRepository.insertExpenseLimit(mockExpense);

            expect(db.insert).toHaveBeenCalledTimes(1);
            expect(db.insert).toHaveBeenCalledWith(budgets)
        });

        test('debe insertar los datos recibidos mediante values', async () => { 
            await gastoRepository.insertExpenseLimit(mockExpense); 
            expect(mocks.values).toHaveBeenCalledTimes(1); 
            expect(mocks.values).toHaveBeenCalledWith(mockExpense); 
        });

        test('debe resolver sin devolver un valor', async () => { 
            const result = await gastoRepository.insertExpenseLimit(mockExpense); 
            expect(result).toBeUndefined(); 
        });

        test('debe propagar el error si falla la inserción', async () => { 
            const error = new Error('Error al insertar el límite'); 
            mocks.values.mockRejectedValueOnce(error); 
            await expect( gastoRepository.insertExpenseLimit(mockExpense)).rejects.toThrow('Error al insertar el límite'); 
        });
    });
    describe('selectUserExpenseLimits', ()=> {
        test('debe consultar la tabla budgets', async () => { 
            await gastoRepository.selectUserExpenseLimits('user-123'); 
            expect(db.select).toHaveBeenCalledTimes(1); 
            expect(mocks.from).toHaveBeenCalledWith(budgets); 
        });

        test('debe filtrar los límites por el ID del usuario', async () => { 
            const userId = 'user-123'; 
            await gastoRepository.selectUserExpenseLimits(userId); 
            expect(eq).toHaveBeenCalledWith( budgets.userId, userId, ); 
            expect(mocks.where).toHaveBeenCalledWith( 'mock-user-filter' ); 
        });

        test('debe devolver los límites obtenidos de la consulta', async () => { 
            const result = await gastoRepository.selectUserExpenseLimits('user-123'); 
            expect(result).toEqual(mockBudgets); 
            expect(result).toHaveLength(2); 
        });

        test('debe devolver una lista vacía cuando el usuario no tiene límites', async () => { 
            mocks.where.mockResolvedValueOnce([]); 
            const result = await gastoRepository.selectUserExpenseLimits('user-456'); 
            expect(result).toEqual([]); 
            expect(result).toHaveLength(0); 
        });

        test('debe propagar el error si falla la consulta', async () => { 
            mocks.where.mockRejectedValueOnce( new Error('Error al consultar los límites') ); 
            await expect( gastoRepository.selectUserExpenseLimits('user-123') ).rejects.toThrow('Error al consultar los límites'); 
        });
    });
});