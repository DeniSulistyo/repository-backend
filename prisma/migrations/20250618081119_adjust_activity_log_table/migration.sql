/*
  Warnings:

  - You are about to drop the column `message` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ActivityLog` table. All the data in the column will be lost.
  - Added the required column `activity` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentId` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programStudiId` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "message",
DROP COLUMN "status",
ADD COLUMN     "activity" TEXT NOT NULL,
ADD COLUMN     "documentId" INTEGER NOT NULL,
ADD COLUMN     "programStudiId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "LogStatus";

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_programStudiId_fkey" FOREIGN KEY ("programStudiId") REFERENCES "ProgramStudi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
