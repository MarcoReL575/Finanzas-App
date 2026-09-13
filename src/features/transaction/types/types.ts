import z from "zod";
import { insertTransactionSchema, selectTransactionSchema } from "../schemas/schemas";

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type SelectTransaction = z.infer<typeof selectTransactionSchema>;