/*
  Warnings:

  - You are about to drop the column `speakerDesc` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `speakerName` on the `Event` table. All the data in the column will be lost.
  - Added the required column `speakerName` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Event` DROP COLUMN `speakerDesc`,
    DROP COLUMN `speakerName`;

-- AlterTable
ALTER TABLE `Schedule` ADD COLUMN `speakerDesc` VARCHAR(191) NULL,
    ADD COLUMN `speakerName` VARCHAR(255) NOT NULL;
