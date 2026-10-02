import { beforeEach, test, vi } from "vitest";
import { describe } from "vitest";
import { newExpenseLimitAction } from "./gastosActions";
import { UserSession } from "@/src/lib/authServer";
import { gastoService } from "../services/gastoService";
import { render } from "@testing-library/react";
import { expect } from "vitest";

vi.mock('@/src/lib/authServer', ()=> ({
    UserSession: vi.fn() 
}));

vi.mock('../services/gastoService', ()=> ({
    gastoService: {
        createExpenseLimit: vi.fn()
    }
}));

describe('gastosActions Test', ()=> {

    const mockExpense = {
        category: 'viajes',
        monto: 500,
        month: 5,
        year: 2026
    }
    
    beforeEach(()=> {
        vi.clearAllMocks()
    });
    
    describe('Usuario autenticado', ()=> {
        test('Debe de mostrar un error si el usuario no tiene una sesión', async()=> {
            vi.mocked(UserSession).mockResolvedValue(null);
    
            const result = await newExpenseLimitAction(mockExpense);
    
            expect(result).toEqual({
                success: false, 
                message: 'El usuario no cuenta con una sesión'
            });
            expect(gastoService.createExpenseLimit).not.toHaveBeenCalled();
        });

        test('no debe llamar al service cuando la sesión no tiene user.id', async()=> {
            vi.mocked(UserSession).mockResolvedValue({
                user: {}
            } as any);
    
            const result = await newExpenseLimitAction(mockExpense);
    
            expect(result).toEqual({
                success: false, 
                message: 'El usuario no cuenta con una sesión'
            });
            expect(gastoService.createExpenseLimit).not.toHaveBeenCalled();
        });
    });

    describe('Usuario autenticado', ()=> {
        test('Debe propagarse el mensaje de error del service', async()=> {
            const userId = 'user-456';

            const serviceResponse = {
                success: false,
                message: 'No fue posible crear el límite',
            }

            vi.mocked(UserSession).mockResolvedValue({
                user: {
                    id: userId,
                }
            } as any);

            vi.mocked(gastoService.createExpenseLimit).mockResolvedValue(serviceResponse)
        });
        
        test('Debe de crear el limite de gsato con éxito', async()=> {
            const userId = 'user-456'
            vi.mocked(UserSession).mockResolvedValue({
                user: {
                    id: userId,
                }
            } as any);

            vi.mocked(gastoService.createExpenseLimit).mockResolvedValue({
                success: true,
                message: 'Límite de gasto creado correctamente',
            })

            const result = await newExpenseLimitAction(mockExpense);
            expect(gastoService.createExpenseLimit).toHaveBeenCalledTimes(1);
            expect(gastoService.createExpenseLimit).toHaveBeenCalledWith(
                mockExpense,
                userId
            )

            expect(result).toEqual({
                success: true,
                message: 'Límite de gasto creado correctamente',
            })
        });
    });
});