-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "password" TEXT,
    "passwordResetToken" UUID,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMPTZ(6) NOT NULL,
    "isLockedOut" BOOLEAN NOT NULL DEFAULT false,
    "roles" TEXT[],
    "search" TEXT,
    "version" UUID NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_emailAddress_key" ON "Users"("emailAddress");
