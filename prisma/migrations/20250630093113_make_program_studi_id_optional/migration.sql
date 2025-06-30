-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_programStudiId_fkey";

-- AlterTable
ALTER TABLE "ActivityLog" ALTER COLUMN "programStudiId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_programStudiId_fkey" FOREIGN KEY ("programStudiId") REFERENCES "ProgramStudi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
