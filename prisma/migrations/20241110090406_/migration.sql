-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('user', 'admin', 'mentor') NOT NULL DEFAULT 'user';
