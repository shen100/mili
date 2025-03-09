CREATE TABLE `post_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
--   KEY `FK_post_message_author` (`author_id`),
--   KEY `FK_post_message_article` (`article_id`),
--   KEY `FK_post_message_collection` (`collection_id`),
--   CONSTRAINT `FK_post_message_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`),
--   CONSTRAINT `FK_post_message_article` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`),
--   CONSTRAINT `FK_post_message_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;