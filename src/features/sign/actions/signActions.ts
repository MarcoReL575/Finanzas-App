'use server';

import { UserAccount } from "../types/types";
import { signService } from "../services/signService";

export async function signUpAction(userInfo: UserAccount) {

    const createUser = await signService.createUser(userInfo);
    return createUser;
}