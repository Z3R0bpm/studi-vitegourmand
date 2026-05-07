-- CreateTable
CREATE TABLE `opening_hours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `day` VARCHAR(50) NOT NULL,
    `opening_time` VARCHAR(50) NOT NULL,
    `closing_time` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allergens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dishes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `picture` BLOB NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dishes_allergens` (
    `dish_id` INTEGER NOT NULL,
    `allergen_id` INTEGER NOT NULL,

    INDEX `idx_dishes_allergens_allergen_id`(`allergen_id`),
    PRIMARY KEY (`dish_id`, `allergen_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `min_group_size` INTEGER NOT NULL DEFAULT 1,
    `price_per_person` DOUBLE NOT NULL,
    `description` VARCHAR(255) NULL,
    `available` INTEGER NULL,
    `theme_id` INTEGER NOT NULL,
    `diet_id` INTEGER NOT NULL,

    INDEX `idx_menus_diet_id`(`diet_id`),
    INDEX `idx_menus_theme_id`(`theme_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menus_dishes` (
    `menu_id` INTEGER NOT NULL,
    `dish_id` INTEGER NOT NULL,

    INDEX `idx_menus_dishes_dish_id`(`dish_id`),
    PRIMARY KEY (`menu_id`, `dish_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_date` DATE NOT NULL,
    `delivery_date` DATE NOT NULL,
    `delivery_time` VARCHAR(50) NOT NULL,
    `order_price` DOUBLE NOT NULL,
    `group_size` INTEGER NOT NULL,
    `delivery_price` DOUBLE NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'On hold',
    `equipment_lending` BOOLEAN NOT NULL DEFAULT false,
    `equipment_return` BOOLEAN NOT NULL DEFAULT false,
    `user_id` INTEGER NOT NULL,

    INDEX `idx_orders_user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders_menus` (
    `order_id` INTEGER NOT NULL,
    `menu_id` INTEGER NOT NULL,

    INDEX `idx_orders_menus_menu_id`(`menu_id`),
    PRIMARY KEY (`order_id`, `menu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `score` INTEGER NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `fk_reviews_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `themes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `city` VARCHAR(50) NULL,
    `country` VARCHAR(50) NULL,
    `address` VARCHAR(50) NULL,
    `role_id` INTEGER NOT NULL,

    UNIQUE INDEX `email`(`email`),
    INDEX `fk_users_role`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dishes_allergens` ADD CONSTRAINT `fk_dishes_allergens_allergen` FOREIGN KEY (`allergen_id`) REFERENCES `allergens`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dishes_allergens` ADD CONSTRAINT `fk_dishes_allergens_dish` FOREIGN KEY (`dish_id`) REFERENCES `dishes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menus` ADD CONSTRAINT `fk_menus_diet` FOREIGN KEY (`diet_id`) REFERENCES `diets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menus` ADD CONSTRAINT `fk_menus_theme` FOREIGN KEY (`theme_id`) REFERENCES `themes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menus_dishes` ADD CONSTRAINT `fk_menus_dishes_dish` FOREIGN KEY (`dish_id`) REFERENCES `dishes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `menus_dishes` ADD CONSTRAINT `fk_menus_dishes_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_menus` ADD CONSTRAINT `fk_orders_menus_menu` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_menus` ADD CONSTRAINT `fk_orders_menus_order` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

