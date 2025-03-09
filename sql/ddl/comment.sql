DROP TABLE IF EXISTS `comments`;

CREATE TABLE
  `comments` (
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    `deleted_at` datetime DEFAULT NULL,
    `html_content` varchar(2000) NOT NULL,
    `status` int NOT NULL,
    `user_id` int NOT NULL,
    `parent_id` int NOT NULL,
    `root_id` int NOT NULL,
    `latest` varchar(100) NOT NULL COMMENT '最近的两条子评论',
    `comment_count` int NOT NULL COMMENT '子评论数',
    `liked_count` int NOT NULL COMMENT '点赞数',
    `source_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_comment_user` (`user_id`)
    --   CONSTRAINT `FK_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- CREATE TABLE
--   `article_comments` (
--     `id` int NOT NULL,
--     PRIMARY KEY (`id`),
--     --   CONSTRAINT `FK_article_comment` FOREIGN KEY (`id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
--     KEY `IDX_article_comment_source` (`source_id`)
--     --   CONSTRAINT `FK_article_comment_article` FOREIGN KEY (`source_id`) REFERENCES `articles` (`id`)
--   ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
DROP TABLE IF EXISTS `book_chapter_comments`;
CREATE TABLE
  `book_chapter_comments` (
    `id` int NOT NULL,
    `collection_id` int NOT NULL,
    PRIMARY KEY (`id`)
    --   CONSTRAINT `FK_book_chapter_comment` FOREIGN KEY (`id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
    -- KEY `IDX_book_chapter_comment_source` (`source_id`)
    --   CONSTRAINT `FK_book_chapter_comment_chapter` FOREIGN KEY (`source_id`) REFERENCES `book_chapters` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `hankbook_chapter_comments`;
CREATE TABLE
  `hankbook_chapter_comments` (
    `id` int NOT NULL,
    `collection_id` int NOT NULL,
    PRIMARY KEY (`id`)
    --   CONSTRAINT `FK_handbook_chapter_comment` FOREIGN KEY (`id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
    -- KEY `IDX_handbook_chapter_comment_source` (`source_id`)
    --   CONSTRAINT `FK_handbook_chapter_comment_chapter` FOREIGN KEY (`source_id`) REFERENCES `handbook_chapters` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `boilingpoint_comments`;
CREATE TABLE
  `boilingpoint_comments` (
    `id` int NOT NULL,
    PRIMARY KEY (`id`)
    --   CONSTRAINT `FK_boilingpoint_comment` FOREIGN KEY (`id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
    -- KEY `IDX_boilingpoint_comment_source` (`source_id`)
    --   CONSTRAINT `FK_boilingpoint_comment_boilingpoint` FOREIGN KEY (`source_id`) REFERENCES `boilingpoints` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;