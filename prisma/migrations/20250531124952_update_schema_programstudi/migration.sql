/*
  Warnings:

  - You are about to drop the column `email` on the `ProgramStudi` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `ProgramStudi` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `ProgramStudi` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProgramStudi_email_key";

-- AlterTable
ALTER TABLE "ProgramStudi" DROP COLUMN "email",
DROP COLUMN "password",
DROP COLUMN "role";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "programStudiId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_programStudiId_fkey" FOREIGN KEY ("programStudiId") REFERENCES "ProgramStudi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
