CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email_address" text NOT NULL,
	"password" text,
	"password_reset_token" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"is_locked_out" boolean DEFAULT false NOT NULL,
	"roles" text[],
	CONSTRAINT "users_email_address_unique" UNIQUE("email_address")
);
