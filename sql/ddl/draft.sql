CREATE TABLE `drafts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `word_count` int NOT NULL,
  `content` text,
  `html_content` text,
  `content_type` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `draft_category` (
  `draft_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`draft_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `draft_tag` (
  `draft_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`draft_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;