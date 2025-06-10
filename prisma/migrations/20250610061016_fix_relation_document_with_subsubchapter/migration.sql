-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_subSubChapterId_fkey" FOREIGN KEY ("subSubChapterId") REFERENCES "SubSubChapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
