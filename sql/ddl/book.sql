-- 创建图书分类表
DROP TABLE IF EXISTS `book_categories`;
CREATE TABLE `book_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `sequence` int NOT NULL,
  `parent_id` int NOT NULL,
  `pathname` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_book_categories_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建图书表
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `summary` varchar(500) DEFAULT NULL,
  `browse_count` int NOT NULL DEFAULT '0',
  `comment_count` int NOT NULL DEFAULT '0',
  `chapter_count` int NOT NULL DEFAULT '0',
  `word_count` int NOT NULL DEFAULT '0',
  `study_user_count` int NOT NULL DEFAULT '0' COMMENT '已学习过此书的人数',
  `cover_url` varchar(200) DEFAULT NULL,
  `status` int NOT NULL,
  `star_user_count` int NOT NULL DEFAULT '0' COMMENT '评价过图书的人数',
  `star` int NOT NULL DEFAULT '0',
  `content` text,
  `html_content` text,
  `content_type` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_books_user_id` (`user_id`)
  -- CONSTRAINT `fk_books_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建图书分类关联表
CREATE TABLE `book_category` (
  `book_id` int NOT NULL,
  `book_category_id` int NOT NULL,
  PRIMARY KEY (`book_id`,`book_category_id`),
  KEY `idx_book_category_category_id` (`book_category_id`)
  -- CONSTRAINT `fk_book_category_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
  -- CONSTRAINT `fk_book_category_category` FOREIGN KEY (`book_category_id`) REFERENCES `book_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建图书章节表
CREATE TABLE `book_chapters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `word_count` int NOT NULL DEFAULT '0',
  `browse_count` int NOT NULL DEFAULT '0',
  `comment_count` int NOT NULL DEFAULT '0',
  `root_comment_count` int NOT NULL DEFAULT '0',
  `content` text,
  `html_content` text,
  `content_type` int NOT NULL,
  `user_id` int NOT NULL,
  `parent_id` int NOT NULL,
  `book_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_book_chapters_user_id` (`user_id`),
  KEY `idx_book_chapters_book_id` (`book_id`),
  KEY `idx_book_chapters_parent_id` (`parent_id`)
--   CONSTRAINT `fk_book_chapters_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
--   CONSTRAINT `fk_book_chapters_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建图书评分表
CREATE TABLE `book_stars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `html_content` varchar(200) NOT NULL,
  `status` int NOT NULL,
  `star` int NOT NULL,
  `book_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_book_stars_book_id` (`book_id`),
  KEY `idx_book_stars_user_id` (`user_id`)
--   CONSTRAINT `fk_book_stars_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`),
--   CONSTRAINT `fk_book_stars_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;