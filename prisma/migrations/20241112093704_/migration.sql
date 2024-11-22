-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `Feedback_submissionId_fkey`;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`submissionId`) ON DELETE CASCADE ON UPDATE CASCADE;
