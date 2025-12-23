CREATE TABLE "users" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email_address" text NOT NULL,
	"normalized_email_address" text GENERATED ALWAYS AS (lower("users"."email_address")) STORED,
	"password" text,
	"password_reset_token" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"is_locked_out" boolean DEFAULT false NOT NULL,
	"roles" text[],
	"search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('english', "users"."first_name" || ' ' || "users"."last_name" || ' ' || "users"."email_address")) STORED,
	CONSTRAINT "pk_users" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "ix_users_normalized_email_address" ON "users" USING btree ("normalized_email_address");--> statement-breakpoint
CREATE INDEX "ix_users_search_vector" ON "users" USING gin ("search_vector");