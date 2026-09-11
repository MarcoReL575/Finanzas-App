import z from "zod";
import { SignUpSchema } from "../schema/schema";

export type UserAccount = z.infer<typeof  SignUpSchema>