DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `activated_at` datetime DEFAULT NULL COMMENT '账号激活时间',
  `username` varchar(100) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `pass` varchar(100) NOT NULL,
  `value` int(11) NOT NULL DEFAULT 0 COMMENT '米粒值',
  `article_count` int(11) NOT NULL DEFAULT 0,
  `article_view_count` int(11) NOT NULL DEFAULT 0 COMMENT '文章被阅读的次数',
  `comment_count` int(11) NOT NULL DEFAULT 0,
  `word_count` int(11) NOT NULL DEFAULT 0 COMMENT '写了多少字',
  `boilingpoint_count` int(11) NOT NULL DEFAULT 0 COMMENT '沸点数量',
  `follow_count` int(11) NOT NULL DEFAULT 0 COMMENT '关注了多少人',
  `follower_count` int(11) NOT NULL DEFAULT 0 COMMENT '被多少人关注',
  `follow_tag_count` int(11) NOT NULL DEFAULT 0 COMMENT '关注了多少个标签',
  `liked_count` int(11) NOT NULL DEFAULT 0 COMMENT '获得多少个赞',
  `u_like_count` int(11) NOT NULL DEFAULT 0 COMMENT '用户一共点了多少个赞',
  `u_article_like_count` int(11) NOT NULL DEFAULT 0 COMMENT '用户对文章点了多少个赞',
  `u_bp_like_count` int(11) NOT NULL DEFAULT 0 COMMENT '用户对沸点点了多少个赞',
  `collection_count` int(11) NOT NULL DEFAULT 0 COMMENT '收藏集的个数',
  `role` int(11) NOT NULL COMMENT '角色',
  `status` int(11) NOT NULL COMMENT '用户状态',
  `avatar_url` varchar(500) NOT NULL COMMENT '头像',
  `sex` tinyint(4) NOT NULL,
  `job` varchar(100) NOT NULL,
  `company` varchar(100) NOT NULL,
  `introduce` varchar(200) NOT NULL COMMENT '个人介绍',
  `personal_hp` varchar(100) NOT NULL COMMENT '个人主页',
  `github_id` int(11) DEFAULT NULL,
  `github_avatar_url` varchar(500) DEFAULT NULL,
  `github_login` varchar(100) DEFAULT NULL,
  `github_name` varchar(100) DEFAULT NULL,
  `weibo_id` int(11) DEFAULT NULL,
  `weibo_screen_name` varchar(100) DEFAULT NULL,
  `weibo_name` varchar(100) DEFAULT NULL,
  `weibo_avatar_large` varchar(500) DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

DROP TABLE IF EXISTS `follower_category`;

CREATE TABLE `follower_category` (
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`category_id`),
  KEY `IDX_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注分类表';

DROP TABLE IF EXISTS `user_collection`;

CREATE TABLE `user_collection` (
  `user_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`collection_id`),
  KEY `IDX_collection_id` (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户创建的专题表';

DROP TABLE IF EXISTS `follower_collection`;

CREATE TABLE `follower_collection` (
  `user_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`collection_id`),
  KEY `IDX_collection_id` (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注的专题表';

DROP TABLE IF EXISTS `contributor_collection`;

CREATE TABLE `contributor_collection` (
  `user_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`collection_id`),
  KEY `IDX_collection_id` (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户投稿的专题表';