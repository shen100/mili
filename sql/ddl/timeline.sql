DROP TABLE IF EXISTS `timeline`;

CREATE TABLE `timeline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `username` varchar(200) NOT NULL,
  `type` varchar(30) NOT NULL COMMENT '事件类型：publish_comment-发表评论,publish_article-发表文章,up_comment-赞了评论,link_article-喜欢文章,follow_user-关注作者,join-加入',
  `article_title` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户时间线表';