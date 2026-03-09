-- CreateTable
CREATE TABLE `Book` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `authors` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `averageRating` DOUBLE NULL,
    `ratingsCount` INTEGER NULL,
    `thumbnailUrl` VARCHAR(191) NULL,
    `price` DOUBLE NULL,
    `category` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
