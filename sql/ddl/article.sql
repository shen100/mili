-- 创建文章表
DROP TABLE IF EXISTS `articles`;
CREATE TABLE
  `articles` (
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    `deleted_at` datetime DEFAULT NULL,
    `last_comment_at` datetime DEFAULT NULL,
    `name` varchar(200) NOT NULL,
    `browse_count` int NOT NULL DEFAULT '0',
    `comment_count` int NOT NULL DEFAULT '0',
    `root_comment_count` int NOT NULL DEFAULT '0',
    `liked_count` int NOT NULL DEFAULT '0',
    `word_count` int NOT NULL DEFAULT '0',
    `hot` int NOT NULL DEFAULT '0',
    `status` int NOT NULL,
    `content` text,
    `html_content` text,
    `summary` varchar(500) DEFAULT NULL,
    `cover_url` varchar(500) DEFAULT NULL,
    `content_type` int NOT NULL,
    `user_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_articles_user_id` (`user_id`),
    KEY `idx_articles_created_at` (`created_at`),
    KEY `idx_articles_status` (`status`)
    --   CONSTRAINT `fk_articles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 创建文章分类关联表
DROP TABLE IF EXISTS `article_category`;
CREATE TABLE
  `article_category` (
    `article_id` int NOT NULL,
    `category_id` int NOT NULL,
    PRIMARY KEY (`article_id`, `category_id`),
    KEY `idx_article_category_category_id` (`category_id`)
    --   CONSTRAINT `fk_article_category_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`),
    --   CONSTRAINT `fk_article_category_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 创建文章标签关联表
DROP TABLE IF EXISTS `article_tag`;
CREATE TABLE
  `article_tag` (
    `article_id` int NOT NULL,
    `tag_id` int NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    KEY `idx_article_tag_tag_id` (`tag_id`)
    --   CONSTRAINT `fk_article_tag_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`),
    --   CONSTRAINT `fk_article_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 创建文章专题关联表
DROP TABLE IF EXISTS `article_collection`;
CREATE TABLE
  `article_collection` (
    `article_id` int NOT NULL,
    `collection_id` int NOT NULL,
    PRIMARY KEY (`article_id`, `collection_id`),
    KEY `idx_article_collection_collection_id` (`collection_id`)
    --   CONSTRAINT `fk_article_collection_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`),
    --   CONSTRAINT `fk_article_collection_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;