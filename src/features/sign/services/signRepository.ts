import { db } from "@/src/db";
import { UserInsert, UserAccount, UserSelect } from "../types/types";
import { user } from "@/src/db/schema/auth-schema";

export interface ISignRepository {
}


class SignRepository implements ISignRepository {
}

export const signRepository = new SignRepository()