-- AlterTable
ALTER TABLE `dishes` ADD COLUMN `dish_type` VARCHAR(50) NOT NULL DEFAULT 'main',
    MODIFY `picture` MEDIUMBLOB NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(60) NOT NULL;
