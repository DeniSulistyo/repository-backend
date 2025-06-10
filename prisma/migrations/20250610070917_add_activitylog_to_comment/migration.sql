-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "activityLogId" INTEGER;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_activityLogId_fkey" FOREIGN KEY ("activityLogId") REFERENCES "ActivityLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
