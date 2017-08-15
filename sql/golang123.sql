# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.35)
# Database: golang123
# Generation Time: 2017-08-15 14:23:12 +0000
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

LOCK TABLES `article_category` WRITE;
/*!40000 ALTER TABLE `article_category` DISABLE KEYS */;

INSERT INTO `article_category` (`id`, `article_id`, `category_id`)
VALUES
	(1,4,2),
	(2,5,2),
	(3,6,2),
	(4,7,1),
	(5,8,1),
	(6,9,1),
	(7,10,1),
	(8,11,1),
	(9,12,1),
	(10,13,1),
	(16,14,3),
	(17,18,2),
	(18,19,2),
	(19,20,2),
	(20,21,2),
	(23,22,2),
	(25,23,3),
	(26,24,2);

/*!40000 ALTER TABLE `article_category` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table articles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `articles`;

CREATE TABLE `articles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `browse_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;

INSERT INTO `articles` (`id`, `name`, `browse_count`, `comment_count`, `status`, `content`, `created_at`, `updated_at`, `deleted_at`, `user_id`)
VALUES
	(22,'test2',0,0,1,'**你们国恨家仇…**   *你们国恨家仇…*\n\n![](https://dev.golang123.com/upload/img/2017/08/02/5ec41a60-beb4-45e7-8c2b-443646171530.jpg)  \n[尝试用thinkjs搭建一套blog](http://wwww,a.com)\n\n\n> 谢邀。 虽然你们国恨家仇…尝试用thinkjs搭建一套blog\n> 尝试用thinkjs搭建一套blog\n> 尝试用thinkjs搭建一套blog\n  \n	   \n		    \n				\n    \n		\n```\n.golang123-editor ol {\n	padding-left: 20px;\n}\n\n.golang123-editor ol li {\n	list-style-type: decimal;\n}\n```\n\n* adfafs\n* asdf\n* asdf\n* asdf\n* asdfa\n* sffadsf\n\n\n-----\n  \n	\n  \n\n\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n\nasdfafa\n\n1. adfasf\n2. asdf\n3. asdfa\n4. sdfasdf\n5. asdf\n6. afdafaf\n\n# adfafaf\n## 尝试用thinkjs搭建一套blog\n### 尝试用thinkjs搭建一套blog\n#### 尝试用thinkjs搭建一套blog\n##### 尝试用thinkjs搭建一套blog\n###### 尝试用thinkjs搭建一套blog','2017-08-02 23:40:01','2017-08-12 11:42:59',NULL,43),
	(23,'111',0,0,1,'123','2017-08-10 22:35:01','2017-08-12 11:42:59',NULL,43),
	(24,'ttt',0,0,1,'adf','2017-08-12 15:47:08','2017-08-12 15:47:08',NULL,43);

/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table categories
# ------------------------------------------------------------

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `slug` varchar(200) NOT NULL DEFAULT '',
  `sequence` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;

INSERT INTO `categories` (`id`, `name`, `slug`, `sequence`, `parent_id`, `status`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(1,'精华','',0,0,1,'2017-07-23 18:03:15','2017-08-10 22:23:00',NULL),
	(2,'招聘','',0,0,1,'2017-07-23 18:03:32','2017-08-12 15:47:08',NULL),
	(3,'分享','',0,0,1,'2017-07-23 18:04:39','2017-08-10 22:35:27',NULL);

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table collects
# ------------------------------------------------------------

DROP TABLE IF EXISTS `collects`;

CREATE TABLE `collects` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `article_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `collects` WRITE;
/*!40000 ALTER TABLE `collects` DISABLE KEYS */;

INSERT INTO `collects` (`id`, `user_id`, `article_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(3,31,23,'2017-08-12 12:21:53','2017-08-12 12:21:53','2017-08-12 12:44:00'),
	(4,31,22,'2017-08-12 12:22:21','2017-08-12 12:22:21','2017-08-12 12:44:50');

/*!40000 ALTER TABLE `collects` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(10000) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `article_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `ups` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;

INSERT INTO `comments` (`id`, `content`, `parent_id`, `article_id`, `status`, `ups`, `user_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(2,'hello',0,24,1,0,43,'2017-08-14 23:38:48','2017-08-14 23:38:48',NULL),
	(3,'aaaa',0,24,1,0,43,'2017-08-14 23:55:59','2017-08-14 23:55:59',NULL),
	(4,'bbb',0,24,1,0,43,'2017-08-14 23:56:40','2017-08-14 23:56:40',NULL),
	(5,'ccc',0,24,1,0,43,'2017-08-14 23:57:38','2017-08-14 23:57:38',NULL);

/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;


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
  `orignal_title` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;

INSERT INTO `images` (`id`, `url`, `width`, `height`, `mime`, `title`, `orignal_title`)
VALUES
	(1,'/upload/img/2017/07/28/1a23f9c7-66c7-411a-af59-6f50ce1f3a44.jpg',0,0,'image/jpeg','1a23f9c7-66c7-411a-af59-6f50ce1f3a44.jpg','5.jpg'),
	(2,'/upload/img/2017/07/28/6bb262f0-63f2-4122-98e6-0e49698f5b90.jpg',0,0,'image/jpeg','6bb262f0-63f2-4122-98e6-0e49698f5b90.jpg','6.jpg'),
	(3,'/upload/img/2017/07/28/eccdd974-d90d-4bb9-a237-26f4dff95fab.jpg',0,0,'image/jpeg','eccdd974-d90d-4bb9-a237-26f4dff95fab.jpg','5.jpg'),
	(4,'/upload/img/2017/07/28/33174951-4b00-40f8-9873-775d527a3d09.jpg',0,0,'image/jpeg','33174951-4b00-40f8-9873-775d527a3d09.jpg','5.jpg'),
	(5,'/upload/img/2017/07/28/7fbe742f-d28a-421b-bae0-8d64e50d82b3.jpg',0,0,'image/jpeg','7fbe742f-d28a-421b-bae0-8d64e50d82b3.jpg','5.jpg'),
	(6,'/upload/img/2017/07/28/919c309e-4d45-414a-b5d1-ba82f6f4e597.jpg',0,0,'image/jpeg','919c309e-4d45-414a-b5d1-ba82f6f4e597.jpg','6.jpg'),
	(7,'/upload/img/2017/07/28/1acf17dc-df6c-4f65-80c4-d880cd953dbb.jpg',0,0,'image/jpeg','1acf17dc-df6c-4f65-80c4-d880cd953dbb.jpg','5.jpg'),
	(8,'/upload/img/2017/07/28/aaea5894-d4c6-4d41-821d-f72ffc758b8c.jpg',0,0,'image/jpeg','aaea5894-d4c6-4d41-821d-f72ffc758b8c.jpg','5.jpg'),
	(9,'/upload/img/2017/07/28/58015e3d-3cd5-42d2-b4ec-962eb839a6b7.jpg',0,0,'image/jpeg','58015e3d-3cd5-42d2-b4ec-962eb839a6b7.jpg','5.jpg'),
	(10,'/upload/img/2017/07/28/004a5b50-7252-4d0f-b84a-ef551f119cdf.jpg',0,0,'image/jpeg','004a5b50-7252-4d0f-b84a-ef551f119cdf.jpg','5.jpg'),
	(11,'/upload/img/2017/07/28/0107bab9-302d-4f47-9bb5-bf745a34960f.jpg',0,0,'image/jpeg','0107bab9-302d-4f47-9bb5-bf745a34960f.jpg','5.jpg'),
	(12,'/upload/img/2017/07/28/9ca133d2-5efc-4106-8dad-babe4ecc3bd1.jpg',0,0,'image/jpeg','9ca133d2-5efc-4106-8dad-babe4ecc3bd1.jpg','5.jpg'),
	(13,'/upload/img/2017/07/28/3c75e674-28ae-47c9-900b-3e221278de20.jpg',0,0,'image/jpeg','3c75e674-28ae-47c9-900b-3e221278de20.jpg','5.jpg'),
	(14,'/upload/img/2017/07/29/80c9df7e-95af-4778-b74c-25f24ef2dfa4.jpg',0,0,'image/jpeg','80c9df7e-95af-4778-b74c-25f24ef2dfa4.jpg','5.jpg'),
	(15,'/upload/img/2017/07/29/cd1aee74-4c25-432c-ad4d-9601c90784f7.png',0,0,'image/png','cd1aee74-4c25-432c-ad4d-9601c90784f7.png','createExp1.png'),
	(16,'/upload/img/2017/08/01/53042a69-d20a-4f47-a88f-0e0169423ef4.jpg',0,0,'image/jpeg','53042a69-d20a-4f47-a88f-0e0169423ef4.jpg','03.jpg'),
	(17,'/upload/img/2017/08/02/5ec41a60-beb4-45e7-8c2b-443646171530.jpg',0,0,'image/jpeg','5ec41a60-beb4-45e7-8c2b-443646171530.jpg','07.jpg');

/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `message`;

CREATE TABLE `message` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `from_user_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `has_read` tinyint(4) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `type` int(11) NOT NULL,
  `chat_id` int(11) DEFAULT NULL,
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



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `phone` varchar(50) DEFAULT NULL,
  `pass` varchar(100) NOT NULL DEFAULT '',
  `score` int(11) unsigned NOT NULL,
  `article_count` int(11) unsigned NOT NULL,
  `collect_count` int(11) unsigned NOT NULL,
  `signature` varchar(200) DEFAULT NULL,
  `role` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `email`, `phone`, `pass`, `score`, `article_count`, `collect_count`, `signature`, `role`, `status`)
VALUES
	(43,'2017-08-14 23:34:02','2017-08-14 23:37:37',NULL,'jack','liushen_shen@163.com','','1502724842c4a0b194c35ceb91da412bbe3ed2d3c1',0,0,0,'',1,2);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
