/*
  Warnings:

  - Added the required column `author` to the `Lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Lessons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Lessons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `lessons` ADD COLUMN `author` VARCHAR(191) NOT NULL,
    ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
