import z from "zod";
import { SignUpSchema } from "../schema/schema";
import { user } from "@/src/db/schema/auth-schema";

export type UserAccount = z.infer<typeof  SignUpSchema>;
export type UserInsert = typeof user.$inferInsert;
export type UserSelect = typeof user.$inferSelect;