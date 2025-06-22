/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Document_slug_key" ON "Document"("slug");
