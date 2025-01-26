/*
  Warnings:

  - You are about to drop the column `createdAt` on the `File` table. All the data in the column will be lost.
  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "createdAt";

-- Add the new `size` column with a default value for existing rows
ALTER TABLE "File" ADD COLUMN "size" INTEGER DEFAULT 0;

-- Make the `size` column NOT NULL and remove the default
ALTER TABLE "File" ALTER COLUMN "size" SET NOT NULL;
ALTER TABLE "File" ALTER COLUMN "size" DROP DEFAULT;

-- Add the new `uploadedAt` column with a default value
ALTER TABLE "File" ADD COLUMN "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
