-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email_address" TEXT NOT NULL,
    "password" TEXT,
    "password_reset_token" UUID,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMPTZ NOT NULL,
    "is_locked_out" BOOLEAN NOT NULL DEFAULT false,
    "roles" TEXT[],
    "version" UUID NOT NULL,
    "search" TEXT,

    CONSTRAINT "pk_users" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ix_users_email_address" ON "users"("email_address");
