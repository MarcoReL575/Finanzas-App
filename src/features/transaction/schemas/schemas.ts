import { transactionSchema } from "@/src/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";

export const insertTransactionSchema = createInsertSchema(transactionSchema).omit({
    userId: true
});
export const selectTransactionSchema = createSelectSchema(transactionSchema);


