import { beforeEach, test, vi } from "vitest";
import { describe } from "vitest";
import { deleteGastoLimitAction, editGastoLimitAction, newExpenseLimitAction, selectExpenseLimitAction } from "./gastosActions";
import { UserSession } from "@/src/lib/authServer";
import { gastoService } from "../services/gastoService";
import { expect } from "vitest";
import { SelectLimiteGasto } from "../types/types";

vi.mock('@/src/lib/authServer', ()=> ({
    UserSession: vi.fn()
}));

vi.mock('../services/gastoService', ()=> ({
    gastoService: {
        createExpenseLimit: vi.fn(),
        deleteUserExpenseLimit: vi.fn(),
        updateExpenseLimit: vi.fn(),
        expenseLimit: vi.fn(),
    }
}));

const userId = 'user-456';
const limitId = 'limit-123';

const mockExpense = {
    category: 'viajes',
    monto: 500,
    month: 5,
    year: 2026
}

const mockExpenseLimit: SelectLimiteGasto = {
    id: limitId,
    userId,
    category: 'viajes',
    monto: 50000,
    month: 5,
    year: 2026,
    createdAt: new Date('2026-05-01'),
}

// Sesiones que las actions deben tratar como "sin sesión"
const sesionesInvalidas = [
    { caso: 'el usuario no tiene una sesión', session: null },
    { caso: 'la sesión no tiene user.id', session: { user: {} } },
];

const mockSesionValida = ()=> {
    vi.mocked(UserSession).mockResolvedValue({
        user: {
            id: userId,
        }
    } as any);
}

describe('gastosActions Test', ()=> {

    beforeEach(()=> {
        vi.clearAllMocks()
    });

    describe('newExpenseLimitAction', ()=> {
        describe('Usuario no autenticado', ()=> {
            test.each(sesionesInvalidas)('Debe de mostrar un error y no llamar al service si $caso', async({ session })=> {
                vi.mocked(UserSession).mockResolvedValue(session as any);

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
                const serviceResponse = {
                    success: false,
                    message: 'No fue posible crear el límite',
                }
                mockSesionValida();
                vi.mocked(gastoService.createExpenseLimit).mockResolvedValue(serviceResponse);

                const result = await newExpenseLimitAction(mockExpense);

                expect(gastoService.createExpenseLimit).toHaveBeenCalledWith(mockExpense, userId);
                expect(result).toEqual(serviceResponse);
            });

            test('Debe de crear el limite de gasto con éxito', async()=> {
                mockSesionValida();
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

    describe('deleteGastoLimitAction', ()=> {
        describe('Usuario no autenticado', ()=> {
            test.each(sesionesInvalidas)('Debe de mostrar un error y no llamar al service si $caso', async({ session })=> {
                vi.mocked(UserSession).mockResolvedValue(session as any);

                const result = await deleteGastoLimitAction(limitId);

                expect(result).toEqual({
                    success: false,
                    message: 'El usuario no cuenta con una sesión'
                });
                expect(gastoService.deleteUserExpenseLimit).not.toHaveBeenCalled();
            });
        });

        describe('Usuario autenticado', ()=> {
            test('Debe propagarse el mensaje de error del service', async()=> {
                const serviceResponse = {
                    success: false,
                    message: 'Error al eliminar el Limite de Gasto',
                }
                mockSesionValida();
                vi.mocked(gastoService.deleteUserExpenseLimit).mockResolvedValue(serviceResponse);

                const result = await deleteGastoLimitAction(limitId);

                expect(result).toEqual(serviceResponse);
            });

            test('Debe de eliminar el límite de gasto con el id del usuario de la sesión', async()=> {
                const serviceResponse = {
                    success: true,
                    message: 'El límite de gasto se ha eliminado correctamente',
                }
                mockSesionValida();
                vi.mocked(gastoService.deleteUserExpenseLimit).mockResolvedValue(serviceResponse);

                const result = await deleteGastoLimitAction(limitId);

                expect(gastoService.deleteUserExpenseLimit).toHaveBeenCalledTimes(1);
                // El orden es (userId, limitId): así solo se puede eliminar un límite propio
                expect(gastoService.deleteUserExpenseLimit).toHaveBeenCalledWith(userId, limitId);
                expect(result).toEqual(serviceResponse);
            });
        });
    });

    describe('editGastoLimitAction', ()=> {
        describe('Usuario no autenticado', ()=> {
            test.each(sesionesInvalidas)('Debe de mostrar un error y no llamar al service si $caso', async({ session })=> {
                vi.mocked(UserSession).mockResolvedValue(session as any);

                const result = await editGastoLimitAction(limitId, mockExpense);

                expect(result).toEqual({
                    success: false,
                    message: 'El usuario no cuenta con una sesión',
                    editExpense: [],
                });
                expect(gastoService.updateExpenseLimit).not.toHaveBeenCalled();
            });
        });

        describe('Usuario autenticado', ()=> {
            test('Debe propagarse el mensaje de error del service', async()=> {
                const serviceResponse = {
                    success: false,
                    message: 'El límite de gasto no se pudo actualizar ',
                }
                mockSesionValida();
                vi.mocked(gastoService.updateExpenseLimit).mockResolvedValue(serviceResponse);

                const result = await editGastoLimitAction(limitId, mockExpense);

                expect(result).toEqual(serviceResponse);
            });

            test('Debe de editar el límite de gasto con éxito', async()=> {
                const serviceResponse = {
                    success: true,
                    message: 'El límite de gasto se ha actualizado ',
                }
                mockSesionValida();
                vi.mocked(gastoService.updateExpenseLimit).mockResolvedValue(serviceResponse);

                const result = await editGastoLimitAction(limitId, mockExpense);

                expect(gastoService.updateExpenseLimit).toHaveBeenCalledTimes(1);
                // La action recibe (limitId, limit) pero el service espera (userId, limit, limitId)
                expect(gastoService.updateExpenseLimit).toHaveBeenCalledWith(userId, mockExpense, limitId);
                expect(result).toEqual(serviceResponse);
            });
        });
    });

    describe('selectExpenseLimitAction', ()=> {
        describe('Usuario no autenticado', ()=> {
            test.each(sesionesInvalidas)('Debe de mostrar un error y no llamar al service si $caso', async({ session })=> {
                vi.mocked(UserSession).mockResolvedValue(session as any);

                const result = await selectExpenseLimitAction(limitId);

                expect(result).toEqual({
                    success: false,
                    message: 'El usuario no cuenta con una sesión',
                    expenseLimit: {},
                });
                expect(gastoService.expenseLimit).not.toHaveBeenCalled();
            });
        });

        describe('Usuario autenticado', ()=> {
            test('Debe propagarse el mensaje de error del service', async()=> {
                const serviceResponse = {
                    success: false,
                    message: 'El límite de gasto no se pudo actualizar ',
                    expenseLimit: {} as SelectLimiteGasto,
                }
                mockSesionValida();
                vi.mocked(gastoService.expenseLimit).mockResolvedValue(serviceResponse);

                const result = await selectExpenseLimitAction(limitId);

                expect(result).toEqual(serviceResponse);
            });

            test('Debe de regresar el límite de gasto solicitado', async()=> {
                const serviceResponse = {
                    success: true,
                    message: 'El límite de gasto se ha actualizado ',
                    expenseLimit: mockExpenseLimit,
                }
                mockSesionValida();
                vi.mocked(gastoService.expenseLimit).mockResolvedValue(serviceResponse);

                const result = await selectExpenseLimitAction(limitId);

                expect(gastoService.expenseLimit).toHaveBeenCalledTimes(1);
                expect(gastoService.expenseLimit).toHaveBeenCalledWith(userId, limitId);
                expect(result).toEqual(serviceResponse);
            });
        });
    });
});
