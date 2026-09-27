
import { db } from "@/src/db";
import { UserSelect, SignIn } from "../types/types";
import { user } from "../../../db/schema/auth-schema";
import { eq } from "drizzle-orm";

export interface ISignRepository {
    selectUser(userInfo: SignIn): Promise<UserSelect | undefined>;
}


export class SignRepository implements ISignRepository {
    async selectUser(userInfo: SignIn): Promise<UserSelect> {
        const [result] = await db
            .select()
            .from(user)
            .where(eq(user.email, userInfo.email))
        return result;
    }
}

export const signRepository = new SignRepository()