import z from "zod";
import { SignInSchema, SignUpSchema, UpdatePasswordUserSchema } from "../schema/schema";
import { user } from "@/src/db/schema/auth-schema";

export type UserAccount = z.infer<typeof  SignUpSchema>;
export type SignIn = z.infer<typeof  SignInSchema>;


export type UserInsert = typeof user.$inferInsert;
export type UserSelect = typeof user.$inferSelect;

export type UpdatePasswordUser = z.infer<typeof UpdatePasswordUserSchema>;