/*
  Warnings:

  - You are about to drop the column `categoryId` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_categoryId_fkey";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "categoryId",
ADD COLUMN     "coverImageId" TEXT;

-- DropTable
DROP TABLE "Category";
