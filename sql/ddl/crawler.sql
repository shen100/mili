CREATE TABLE `crawler_articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `title` varchar(500) NOT NULL,
  `content` text NOT NULL,
  `url` varchar(1000) NOT NULL,
  `from` int NOT NULL,
  `article_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;