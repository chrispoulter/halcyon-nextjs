-- Add 2FA fields to users table
ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "two_factor_enabled" boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "two_factor_secret" text,
    ADD COLUMN IF NOT EXISTS "two_factor_recovery_codes" text[];
