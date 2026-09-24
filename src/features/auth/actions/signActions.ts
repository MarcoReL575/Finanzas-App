'use server';

import { SignIn, UpdatePasswordUser, UserAccount } from "../types/types";
import { signService } from "../services/signService";
import { UserSession } from "@/src/lib/authServer";

export async function signUpAction(userInfo: UserAccount) {
    const createUser = await signService.createUser(userInfo);
    return createUser;
}

export async function signInAction(userInfo: SignIn) {
    const login = await signService.signIn(userInfo);
    return login
}

export async function updatePasswordUserAction(data: UpdatePasswordUser) {
    const session = await UserSession();
    if(!session?.user.id)  return { success: false, message: 'Ha ocurrido un problema' }  

    return await signService.updatePasswordUser(data)
}