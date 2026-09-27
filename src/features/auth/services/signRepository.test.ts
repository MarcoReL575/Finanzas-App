import { db } from "@/src/db";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { SignRepository } from "./signRepository";

vi.mock('@/src/db', ()=> ({
    db: {
        select: vi.fn()
    }
}));

describe('Sign Repository Test', ()=> {
    let signRespository: SignRepository;
    beforeEach(() => {
        vi.clearAllMocks();

        signRespository = new SignRepository();
    });

    describe('selectUser', ()=> {
        test('Debe devolver al usuario si el email existe', async()=> {
            const user = {
                id: "user-123",
                name: "Marco",
                email: "marco@test.com",
            };

            const whereMock = vi.fn().mockResolvedValue([user]);
            const fromMock = vi.fn().mockReturnValue({
                where: whereMock
            });

            vi.mocked(db.select).mockReturnValue({
                from: fromMock
            } as any)

            const result = await signRespository.selectUser({
                email: "marco@test.com",
                password: "Password123",
            })

            expect(result).toEqual(user);
            expect(db.select).toHaveBeenCalled();
            expect(fromMock).toHaveBeenCalled();
            expect(whereMock).toHaveBeenCalled();
        });

        test('Debe de retornar undefined si el usuario no existe', async()=> {
            const whereMock = vi.fn().mockResolvedValue([]);
            const fromMock = vi.fn().mockReturnValue({
                where: whereMock
            });

            vi.mocked(db.select).mockReturnValue({
                from: fromMock
            } as any);

            const result = await signRespository.selectUser({
                email: "unknown@test.com",
                password: "Password123",
            });

            expect(result).toBeUndefined();

        });

        test('Debe de propagar el error de la base de datos', async()=> {
            const dbErrors = new Error('Error de conexión');

             const whereMock = vi.fn().mockRejectedValue(dbErrors);


            const fromMock = vi.fn().mockReturnValue({
                where: whereMock,
            });

            vi.mocked(db.select).mockReturnValue({
                from: fromMock,
            } as any);

            await expect(
                signRespository.selectUser({
                    email: "marco@test.com",
                    password: "Password123",
                })
            ).rejects.toThrow("Error de conexión");
        });

    });
});