CREATE DATABASE IF NOT EXISTS `hbooking`;

USE `hbooking`;

CREATE TABLE
    IF NOT EXISTS `users` (
        `user_id` BIGINT,
        `user_name` VARCHAR(255) UNIQUE NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) UNIQUE NOT NULL,
        `phone_number` VARCHAR(20),
        `gender` INT,
        `full_name` VARCHAR(255) NOT NULL,
        `avatar` VARCHAR(255),
        `is_verified` BOOLEAN NOT NULL DEFAULT false,
        `verification_code` VARCHAR(20),
        `role` INT NOT NULL,
        `created_at` BIGINT NOT NULL,
        `updated_at` BIGINT NOT NULL,
        PRIMARY KEY (`user_id`)
    );

CREATE TABLE
    IF NOT EXISTS `homestays` (
        `homestay_id` BIGINT,
        `user_id` BIGINT NOT NULL,
        `name` VARCHAR(255) NOT NULL,
        `description` TEXT,
        `ward` INT,
        `district` INT,
        `province` INT,
        `created_at` BIGINT NOT NULL,
        `updated_at` BIGINT NOT NULL,
        PRIMARY KEY (`homestay_id`)
    );

CREATE TABLE
    IF NOT EXISTS `rooms` (
        `room_id` BIGINT NOT NULL,
        `homestay_id` BIGINT NOT NULL,
        `room_name` VARCHAR(255) NOT NULL,
        `room_type` INT NOT NULL COMMENT "1: single, 2: double",
        `price` DECIMAL(15, 2) NOT NULL,
        `status` INT DEFAULT 0 COMMENT "0: con trong, 1: da duoc dat",
        `created_at` BIGINT NOT NULL,
        `updated_at` BIGINT NOT NULL,
        PRIMARY KEY (`room_id`)
    );

CREATE TABLE
    IF NOT EXISTS `user_rooms` (
        `user_room_id` BIGINT,
        `user_id` BIGINT,
        `homestay_id` BIGINT,
        `created_at` BIGINT NOT NULL,
        `updated_at` BIGINT NOT NULL,
        PRIMARY KEY (`user_room_id`)
    );

CREATE TABLE
    IF NOT EXISTS `bookings` (
        `booking_id` BIGINT,
        `user_id` BIGINT,
        `room_id` BIGINT,
        `check_in_date` BIGINT,
        `check_out_date` BIGINT,
        `deposit_price` DECIMAL(15, 2),
        `total_price` DECIMAL(15, 2),
        `status` INT DEFAULT 1 NOT NULL COMMENT "1: chua thanh toan, 2: da thanh toan",
        `created_at` BIGINT NOT NULL,
        `updated_at` BIGINT NOT NULL,
        PRIMARY KEY (`booking_id`)
    );

CREATE TABLE
    IF NOT EXISTS `services` (
        `service_id` BIGINT,
        `service_name` VARCHAR(255) NOT NULL,
        `description` TEXT,
        `price` DECIMAL(15, 2) NOT NULL,
        `created_at` BIGINT NOT NULL,
        `updated_at` BIGINT NOT NULL,
        PRIMARY KEY (`service_id`)
    );

CREATE TABLE
    IF NOT EXISTS `reviews` (
        `review_id` BIGINT,
        `user_id` BIGINT,
        `homestay_id` BIGINT,
        `rate` INT,
        `comment` TEXT,
        `created_at` BIGINT NOT NULL,
        `updated_at` BIGINT NOT NULL,
        PRIMARY KEY (`review_id`)
    );

CREATE TABLE
    IF NOT EXISTS `photos` (
        `photo_id` BIGINT,
        `entity_id` BIGINT COMMENT 'id of room or homestay' NOT NULL,
        `url` VARCHAR(255) DEFAULT "" NOT NULL,
        `entity_type` INT DEFAULT 0 COMMENT '2: ENTITY_TYPE_ROOM, 3: ENTITY_TYPE_HOMESTAY' NOT NULL,
        `created_at` BIGINT NOT NULL,
        `updated_at` BIGINT NOT NULL,
        PRIMARY KEY (`photo_id`)
    );