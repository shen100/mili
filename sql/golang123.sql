# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.35)
# Database: golang123
# Generation Time: 2018-04-12 15:52:36 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table article_category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `article_category`;

CREATE TABLE `article_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(11) unsigned NOT NULL,
  `category_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table articles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `articles`;

CREATE TABLE `articles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `browse_count` int(11) unsigned NOT NULL DEFAULT '0',
  `comment_count` int(11) unsigned NOT NULL DEFAULT '0',
  `collect_count` int(11) unsigned NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` longtext,
  `html_content` longtext,
  `content_type` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `last_comment_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `last_user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table book_categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `book_categories`;

CREATE TABLE `book_categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL DEFAULT '',
  `sequence` int(11) NOT NULL,
  `parent_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `book_category`;

CREATE TABLE `book_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `book_id` int(11) unsigned NOT NULL,
  `book_category_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# Dump of table book_chapter_comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `book_chapter_comments`;

CREATE TABLE `book_chapter_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT '',
  `content` longtext,
  `html_content` longtext,
  `content_type` int(11) NOT NULL,
  `parent_id` int(11) unsigned NOT NULL,
  `book_id` int(11) unsigned NOT NULL,
  `chapter_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table book_chapters
# ------------------------------------------------------------

DROP TABLE IF EXISTS `book_chapters`;

CREATE TABLE `book_chapters` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL DEFAULT '',
  `browse_count` int(11) unsigned NOT NULL,
  `comment_count` int(11) unsigned NOT NULL,
  `content` longtext,
  `html_content` longtext,
  `content_type` int(11) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `parent_id` int(11) unsigned NOT NULL,
  `book_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table book_comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `book_comments`;

CREATE TABLE `book_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT '',
  `star` int(11) unsigned NOT NULL,
  `content` longtext,
  `html_content` longtext,
  `content_type` int(11) NOT NULL,
  `parent_id` int(11) unsigned NOT NULL,
  `book_id` int(11) unsigned NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table books
# ------------------------------------------------------------

DROP TABLE IF EXISTS `books`;

CREATE TABLE `books` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL DEFAULT '',
  `cover_url` varchar(200) DEFAULT NULL,
  `browse_count` int(11) unsigned NOT NULL,
  `comment_count` int(11) unsigned NOT NULL,
  `collect_count` int(11) unsigned NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT '',
  `read_limits` varchar(100) NOT NULL DEFAULT '',
  `content` longtext,
  `html_content` longtext,
  `content_type` int(11) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `star` int(11) unsigned NOT NULL,
  `one_star_count` int(11) unsigned NOT NULL,
  `two_star_count` int(11) unsigned NOT NULL,
  `three_star_count` int(11) unsigned NOT NULL,
  `four_star_count` int(11) unsigned NOT NULL,
  `five_star_count` int(11) unsigned NOT NULL,
  `total_star_count` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table careers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `careers`;

CREATE TABLE `careers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `company` varchar(200) NOT NULL DEFAULT '',
  `title` varchar(200) NOT NULL DEFAULT '',
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `sequence` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table collects
# ------------------------------------------------------------

DROP TABLE IF EXISTS `collects`;

CREATE TABLE `collects` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `source_id` int(11) unsigned NOT NULL,
  `source_name` varchar(100) NOT NULL DEFAULT '',
  `folder_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content` longtext,
  `html_content` longtext,
  `content_type` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `ups` int(11) NOT NULL DEFAULT '0',
  `source_id` int(11) unsigned NOT NULL,
  `source_name` varchar(100) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table crawler_articles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `crawler_articles`;

CREATE TABLE `crawler_articles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(500) NOT NULL DEFAULT '',
  `content` longtext NOT NULL,
  `url` varchar(4000) NOT NULL,
  `from` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `article_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table folders
# ------------------------------------------------------------

DROP TABLE IF EXISTS `folders`;

CREATE TABLE `folders` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL DEFAULT '' COMMENT '收藏夹名称',
  `parent_id` int(11) unsigned NOT NULL COMMENT '父收藏夹, 0表示无父收藏夹',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table images
# ------------------------------------------------------------

DROP TABLE IF EXISTS `images`;

CREATE TABLE `images` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(200) NOT NULL DEFAULT '',
  `width` int(11) unsigned DEFAULT NULL,
  `height` int(11) unsigned DEFAULT NULL,
  `mime` varchar(20) NOT NULL DEFAULT '',
  `title` varchar(100) NOT NULL DEFAULT '',
  `orignal_title` varchar(500) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table key_value_configs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `key_value_configs`;

CREATE TABLE `key_value_configs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) NOT NULL DEFAULT '',
  `value` varchar(500) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table messages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `from_user_id` int(11) NOT NULL,
  `to_user_id` int(11) NOT NULL,
  `source_id` int(11) NOT NULL,
  `source_name` varchar(100) NOT NULL DEFAULT '',
  `comment_id` int(11) unsigned DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `readed` tinyint(1) NOT NULL,
  `type` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table schools
# ------------------------------------------------------------

DROP TABLE IF EXISTS `schools`;

CREATE TABLE `schools` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) NOT NULL DEFAULT '',
  `speciality` varchar(200) NOT NULL DEFAULT '',
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table top_articles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `top_articles`;

CREATE TABLE `top_articles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table ups
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ups`;

CREATE TABLE `ups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `target_id` int(11) unsigned NOT NULL COMMENT '文章id或评论id',
  `type` int(11) NOT NULL COMMENT '1:为文章点赞;2:为评论点赞;',
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table user_votes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_votes`;

CREATE TABLE `user_votes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `vote_id` int(11) unsigned NOT NULL,
  `vote_item_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `activated_at` datetime DEFAULT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(50) DEFAULT '',
  `phone` varchar(50) DEFAULT NULL,
  `pass` varchar(100) NOT NULL DEFAULT '',
  `score` int(11) unsigned NOT NULL,
  `article_count` int(11) unsigned NOT NULL DEFAULT '0',
  `collect_count` int(11) unsigned NOT NULL DEFAULT '0',
  `signature` varchar(200) DEFAULT NULL,
  `role` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `avatar_url` varchar(500) NOT NULL DEFAULT '',
  `cover_url` varchar(500) DEFAULT NULL,
  `comment_count` int(11) unsigned NOT NULL,
  `sex` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `location` varchar(200) DEFAULT NULL,
  `introduce` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table vote_items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vote_items`;

CREATE TABLE `vote_items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `count` int(11) unsigned NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `vote_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table votes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `votes`;

CREATE TABLE `votes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `browse_count` int(11) unsigned NOT NULL DEFAULT '0',
  `comment_count` int(11) unsigned NOT NULL DEFAULT '0',
  `collect_count` int(11) unsigned NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` longtext,
  `html_content` longtext,
  `content_type` int(11) NOT NULL,
  `end_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `last_comment_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `last_user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (
  `created_at`,
  `updated_at`,
  `deleted_at`,
  `name`,
  `pass`,
  `email`,
  `sex`,
  `location`,
  `introduce`,
  `phone`,
  `score`,
  `article_count`,
  `comment_count`,
  `collect_count`,
  `signature`,
  `role`,
  `avatar_url`,
  `cover_url`,
  `status`
) VALUES (
  now(),
  now(),
  NULL,
  'golang123',
  '1520046516c8c86ea21899d7392ed8d21e47d501c7',
  '',
  '0',
  '',
  '',
  '',
  '0',
  '0',
  '0',
  '0',
  '',
  '3',
  '/images/avatar/1.png',
  '',
  '2'
);

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
