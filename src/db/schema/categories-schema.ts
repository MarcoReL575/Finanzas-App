import { pgTable, text } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }), // null si es categoría global
  name: text('name').notNull(),
  icon: text('icon'), // ej. "shopping-cart", "utensils"
  color: text('color'), // ej. "#FF5733"
});