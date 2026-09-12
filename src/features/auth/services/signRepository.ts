import { db } from "@/src/db";
import { UserInsert, UserAccount, UserSelect, SignIn } from "../types/types";
import { user } from "@/src/db/schema/auth-schema";
import { User } from "better-auth";
import { eq } from "drizzle-orm";

export interface ISignRepository {
    selectUser(userInfo: SignIn): Promise<UserSelect>;
}


class SignRepository implements ISignRepository {
    async selectUser(userInfo: SignIn): Promise<UserSelect> {
        const [result] = await db
            .select()
            .from(user)
            .where(eq(user.email, userInfo.email))
        return result;
    }
}

export const signRepository = new SignRepository()