-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "validatedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_validatedBy_fkey" FOREIGN KEY ("validatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
