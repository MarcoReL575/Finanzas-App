CREATE TABLE "budgets" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"category" text NOT NULL,
	"cantidad" numeric(12,2) NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "budgets_user_id_category_month_year_unique" UNIQUE("user_id","category","month","year")
);
--> statement-breakpoint
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;