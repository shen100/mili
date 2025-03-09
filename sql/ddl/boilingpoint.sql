-- 创建沸点主题表
DROP TABLE IF EXISTS `boilingpoint_topics`;

CREATE TABLE
  `boilingpoint_topics` (
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` datetime NOT NULL,
    `updated_at` datetime NOT NULL,
    `name` varchar(200) NOT NULL,
    `icon` varchar(500) NOT NULL,
    `sequence` int NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 创建沸点表
DROP TABLE IF EXISTS `boilingpoints`;

CREATE TABLE
  `boilingpoints` (
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` datetime NOT NULL,
    `browse_count` int NOT NULL DEFAULT '0',
    `comment_count` int NOT NULL DEFAULT '0',
    `root_comment_count` int NOT NULL DEFAULT '0',
    `liked_count` int NOT NULL DEFAULT '0',
    `html_content` varchar(2000) NOT NULL,
    `summary` varchar(100) NOT NULL,
    `imgs` varchar(2000) NOT NULL,
    `topic_id` int NOT NULL,
    `user_id` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_boilingpoints_topic_id` (`topic_id`),
    KEY `idx_boilingpoints_user_id` (`user_id`)
    --   CONSTRAINT `fk_boilingpoints_topic` FOREIGN KEY (`topic_id`) REFERENCES `boilingpoint_topics` (`id`),
    --   CONSTRAINT `fk_boilingpoints_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- 创建沸点举报表
DROP TABLE IF EXISTS `boilingpoint_reports`;

CREATE TABLE
  `boilingpoint_reports` (
    `id` int NOT NULL AUTO_INCREMENT,
    `created_at` datetime NOT NULL,
    `boilingpoint_id` int NOT NULL,
    `reason` tinyint NOT NULL COMMENT '1、和话题不符 2、恶意攻击谩骂 3、广告营销 0、其它',
    `reporter` int NOT NULL COMMENT '举报人',
    PRIMARY KEY (`id`),
    KEY `idx_boilingpoint_reports_boilingpoint_id` (`boilingpoint_id`),
    KEY `idx_boilingpoint_reports_reporter` (`reporter`)
    --   CONSTRAINT `fk_boilingpoint_reports_boilingpoint` FOREIGN KEY (`boilingpoint_id`) REFERENCES `boilingpoints` (`id`),
    --   CONSTRAINT `fk_boilingpoint_reports_user` FOREIGN KEY (`reporter`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;