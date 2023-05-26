-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "password" TEXT,
    "passwordResetToken" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "isLockedOut" BOOLEAN NOT NULL DEFAULT false,
    "roles" TEXT[],

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_emailAddress_key" ON "Users"("emailAddress");
