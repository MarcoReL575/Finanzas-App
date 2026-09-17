import z from "zod";
import { insertTransactionSchema, selectTransactionSchema } from "../schemas/schemas";

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type SelectTransaction = z.infer<typeof selectTransactionSchema>;

export interface PaginationParams {
  page: number;
  limit: number;
};

export interface PaginatedResult<T> {
  items: T[];
  hasMore: boolean;
  total: number;
  page: number;
  limit: number;
};