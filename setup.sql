-- Database Setup for ConcertMatch

CREATE DATABASE IF NOT EXISTS `concert_match`;
USE `concert_match`;

DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `matches`;
DROP TABLE IF EXISTS `users`;

-- Users Table
-- Stores profile info, "Spotify" top artists/genres, and extensive vibe checks.
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `age` INT,
    `bio` TEXT,
    `profile_pic` VARCHAR(255) DEFAULT 'default_avatar.png',
    `top_artists` TEXT, -- JSON or comma-separated list of artists
    `top_genres` TEXT, -- JSON or comma-separated list of genres
    `vibe_tags` TEXT, -- e.g. "Mosh Pit", "Chill", "Front Row"
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches Table
-- Who matched with whom. status: 'pending', 'matched', 'rejected'
CREATE TABLE `matches` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id_1` INT NOT NULL,
    `user_id_2` INT NOT NULL,
    `status` ENUM('pending', 'matched', 'rejected') DEFAULT 'pending',
    `matched_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id_1`) REFERENCES `users`(`id`),
    FOREIGN KEY (`user_id_2`) REFERENCES `users`(`id`)
);

-- Media Table
-- Videos or photos uploaded by users to show off their concert experiences.
CREATE TABLE `media` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `media_type` ENUM('video', 'image') DEFAULT 'video',
    `caption` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- DUMMY DATA --

INSERT INTO `users` (`username`, `age`, `bio`, `profile_pic`, `top_artists`, `top_genres`, `vibe_tags`) VALUES
('Alice_Rocker', 24, 'Live for the mosh pit. Looking for concert buddies!', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', 'Metallica, Iron Maiden, Paramore', 'Metal, Rock, Punk', 'Mosh Pit, High Energy'),
('Bob_The_Vibe', 26, 'Just here for the music and good times.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', 'Tame Impala, Glass Animals, The Weeknd', 'Indie, Psychedelic, Pop', 'Chill, Back Row, Drinks'),
('Charlie_Bass', 22, 'Dubstep and D&B essentially.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie', 'Skrillex, Excision, Subtronics', 'Dubstep, EDM', 'Headbanger, Rail');
