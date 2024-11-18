/*
  Warnings:

  - You are about to drop the column `createdAr` on the `issue` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `issue` DROP COLUMN `createdAr`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
