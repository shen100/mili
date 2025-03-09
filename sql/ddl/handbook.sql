DROP TABLE IF EXISTS `handbooks`;

CREATE TABLE `handbooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(200) NOT NULL,
  `introduce` text,
  `summary` varchar(200) NOT NULL,
  `author_intro` varchar(200) NOT NULL,
  `price` int NOT NULL,
  `completion_at` datetime NOT NULL,
  `is_all_done` tinyint(1) NOT NULL,
  `is_agree` tinyint(1) NOT NULL,
  `cover_url` varchar(500) NOT NULL,
  `word_count` int NOT NULL,
  `sale_count` int NOT NULL,
  `comment_count` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `handbook_chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(200) NOT NULL,
  `browse_count` int NOT NULL,
  `comment_count` int NOT NULL,
  `root_comment_count` int NOT NULL,
  `try_read` tinyint(1) NOT NULL,
  `content` text,
  `html_content` text,
  `word_count` int NOT NULL,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  PRIMARY KEY (`id`)
--   KEY `FK_handbook_chapters_book` (`book_id`),
--   CONSTRAINT `FK_handbook_chapters_book` FOREIGN KEY (`book_id`) REFERENCES `handbooks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;