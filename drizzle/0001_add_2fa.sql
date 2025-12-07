ALTER TABLE "users" ADD COLUMN "two_factor_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_secret" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_temp_secret" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "two_factor_recovery_codes" text[];