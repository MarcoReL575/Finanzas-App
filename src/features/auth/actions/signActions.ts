'use server';

import { SignIn, UserAccount } from "../types/types";
import { signService } from "../services/signService";

export async function signUpAction(userInfo: UserAccount) {
    const createUser = await signService.createUser(userInfo);
    return createUser;
}

export async function signInAction(userInfo: SignIn) {
    const login = await signService.signIn(userInfo);
    return login
}