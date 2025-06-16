-- AlterTable
ALTER TABLE "SubSubChapter" ADD COLUMN     "chapterId" INTEGER;

-- AddForeignKey
ALTER TABLE "SubSubChapter" ADD CONSTRAINT "SubSubChapter_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
