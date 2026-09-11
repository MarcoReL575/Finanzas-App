CREATE TYPE "transaction_type" AS ENUM('income', 'expense', 'transfer');--> statement-breakpoint
CREATE TABLE "categoria" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categoria_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"type" integer NOT NULL,
	"createdAt" varchar(255) NOT NULL UNIQUE
);
