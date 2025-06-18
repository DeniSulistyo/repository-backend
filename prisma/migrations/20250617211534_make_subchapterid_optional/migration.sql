-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "subChapterId" INTEGER;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_subChapterId_fkey" FOREIGN KEY ("subChapterId") REFERENCES "SubChapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
