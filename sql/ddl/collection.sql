DROP TABLE IF EXISTS `collections`;

CREATE TABLE
  `collections` (
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    `name` varchar(200) NOT NULL,
    `article_count` int NOT NULL COMMENT '收录的文章数',
    `follower_count` int NOT NULL COMMENT '有多少人关注此专题',
    `announcement` varchar(500) NOT NULL COMMENT '专题公告',
    `allow_post` tinyint (1) NOT NULL COMMENT '是否允许投稿',
    `post_must_audit` tinyint (1) NOT NULL COMMENT '投稿是否需要审核',
    `cover_url` varchar(500) NOT NULL COMMENT '封面',
    `creator_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_collection_creator` (`creator_id`)
    --   CONSTRAINT `FK_collection_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- CREATE TABLE `article_collection` (
--   `article_id` int NOT NULL,
--   `collection_id` int NOT NULL,
--   PRIMARY KEY (`article_id`,`collection_id`),
--   KEY `IDX_article_collection_collection` (`collection_id`)
-- --   CONSTRAINT `FK_article_collection_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
-- --   CONSTRAINT `FK_article_collection_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE
  `collection_admins` (
    `collection_id` int NOT NULL,
    `user_id` int NOT NULL,
    PRIMARY KEY (`collection_id`, `user_id`),
    KEY `IDX_collection_admin_user` (`user_id`)
    --   CONSTRAINT `FK_collection_admin_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
    --   CONSTRAINT `FK_collection_admin_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  `collection_followers` (
    `collection_id` int NOT NULL,
    `user_id` int NOT NULL,
    PRIMARY KEY (`collection_id`, `user_id`),
    KEY `IDX_collection_follower_user` (`user_id`)
    --   CONSTRAINT `FK_collection_follower_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
    --   CONSTRAINT `FK_collection_follower_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE
  `collection_contributors` (
    `collection_id` int NOT NULL,
    `user_id` int NOT NULL,
    PRIMARY KEY (`collection_id`, `user_id`),
    KEY `IDX_collection_contributor_user` (`user_id`)
    --   CONSTRAINT `FK_collection_contributor_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE,
    --   CONSTRAINT `FK_collection_contributor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;