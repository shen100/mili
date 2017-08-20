# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.35)
# Database: golang123
# Generation Time: 2017-08-20 07:46:33 +0000
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
	(26,24,2),
	(27,25,2),
	(28,26,3),
	(29,27,3),
	(30,28,2);

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
	(22,'test2',33,3,1,'<p><strong>你们国恨家仇…</strong>   <em>你们国恨家仇…</em></p>\n\n<p><img src=\"https://dev.golang123.com/upload/img/2017/08/02/5ec41a60-beb4-45e7-8c2b-443646171530.jpg\" alt=\"\"/><br/>\n<a href=\"http://wwww,a.com\" rel=\"nofollow\">尝试用thinkjs搭建一套blog</a></p>\n\n<blockquote>\n<p>谢邀。 虽然你们国恨家仇…尝试用thinkjs搭建一套blog\n尝试用thinkjs搭建一套blog\n尝试用thinkjs搭建一套blog</p>\n</blockquote>\n\n<pre><code>.golang123-editor ol {\n    padding-left: 20px;\n}\n\n.golang123-editor ol li {\n    list-style-type: decimal;\n}\n</code></pre>\n\n<ul>\n<li>adfafs</li>\n<li>asdf</li>\n<li>asdf</li>\n<li>asdf</li>\n<li>asdfa</li>\n<li>sffadsf</li>\n</ul>\n\n<hr/>\n\n<table>\n<thead>\n<tr>\n<th>Column 1</th>\n<th>Column 2</th>\n<th>Column 3</th>\n</tr>\n</thead>\n\n<tbody>\n<tr>\n<td>Text</td>\n<td>Text</td>\n<td>Text</td>\n</tr>\n</tbody>\n</table>\n\n<p>asdfafa</p>\n\n<ol>\n<li>adfasf</li>\n<li>asdf</li>\n<li>asdfa</li>\n<li>sdfasdf</li>\n<li>asdf</li>\n<li>afdafaf</li>\n</ol>\n\n<h1>adfafaf</h1>\n\n<h2>尝试用thinkjs搭建一套blog</h2>\n\n<h3>尝试用thinkjs搭建一套blog</h3>\n\n<h4>尝试用thinkjs搭建一套blog</h4>\n\n<h5>尝试用thinkjs搭建一套blog</h5>\n\n<h6>尝试用thinkjs搭建一套blog</h6>\n','2017-08-02 23:40:01','2017-08-18 23:56:59',NULL,43),
	(23,'111',5,1,1,'123','2017-08-10 22:35:01','2017-08-18 23:56:21',NULL,43),
	(24,'ttt',13,2,1,'adf','2017-08-12 15:47:08','2017-08-17 23:28:09',NULL,43),
	(25,'3',9,3,1,'333','2017-08-17 23:02:02','2017-08-17 23:04:55',NULL,43),
	(26,'4',9,0,1,'444','2017-08-17 23:02:10','2017-08-18 23:57:04',NULL,43),
	(27,'5',34,4,1,'55','2017-08-17 23:02:20','2017-08-20 14:25:24',NULL,43),
	(28,'测试一下工asdk进基',13,0,1,'只呀ladf在兴保工我不不工我扔革一单单产','2017-08-19 00:46:33','2017-08-20 15:09:51',NULL,43);

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
	(2,'招聘','',0,0,1,'2017-07-23 18:03:32','2017-08-19 00:46:33',NULL),
	(3,'分享','',0,0,1,'2017-07-23 18:04:39','2017-08-17 23:02:20',NULL);

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
  `source_id` int(11) unsigned NOT NULL,
  `source_name` varchar(100) NOT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;

INSERT INTO `comments` (`id`, `content`, `parent_id`, `article_id`, `status`, `ups`, `source_id`, `source_name`, `user_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(2,'hello',0,24,1,0,0,'',43,'2017-08-14 23:38:48','2017-08-14 23:38:48',NULL),
	(3,'aaaa',0,24,1,0,0,'',43,'2017-08-14 23:55:59','2017-08-14 23:55:59',NULL),
	(4,'bbb',0,24,1,0,0,'',43,'2017-08-14 23:56:40','2017-08-14 23:56:40',NULL),
	(5,'ccc',0,24,1,0,0,'',43,'2017-08-14 23:57:38','2017-08-14 23:57:38',NULL),
	(6,'rrr',0,22,1,0,0,'',43,'2017-08-17 22:47:06','2017-08-17 22:52:30',NULL),
	(7,'xxx',0,22,1,0,0,'',43,'2017-08-17 22:58:22','2017-08-17 22:58:22',NULL),
	(8,'wwww',0,22,1,0,0,'',43,'2017-08-17 22:58:30','2017-08-17 22:58:30',NULL),
	(9,'aaa',0,22,1,0,0,'',43,'2017-08-17 22:59:26','2017-08-17 22:59:26',NULL),
	(10,'33',0,27,1,0,0,'',43,'2017-08-17 23:04:13','2017-08-17 23:04:13',NULL),
	(11,'22',0,27,1,0,0,'',43,'2017-08-17 23:04:16','2017-08-17 23:04:16',NULL),
	(12,'11',0,27,1,0,0,'',43,'2017-08-17 23:04:18','2017-08-17 23:04:18',NULL),
	(13,'22',0,25,1,0,0,'',43,'2017-08-17 23:04:24','2017-08-17 23:04:24',NULL),
	(14,'12',0,25,1,0,0,'',43,'2017-08-17 23:04:25','2017-08-17 23:04:25',NULL),
	(15,'asdf',0,27,1,0,0,'',43,'2017-08-17 23:04:50','2017-08-17 23:04:50',NULL),
	(16,'asf',0,25,1,0,0,'',43,'2017-08-17 23:04:55','2017-08-17 23:04:55',NULL),
	(17,'af',0,24,1,0,0,'',43,'2017-08-17 23:05:04','2017-08-17 23:05:04',NULL),
	(18,'asf',0,24,1,0,0,'',43,'2017-08-17 23:05:06','2017-08-17 23:05:06',NULL),
	(19,'af',0,23,1,0,0,'',43,'2017-08-17 23:05:11','2017-08-17 23:05:11',NULL);

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
  `avatar_url` varchar(500) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `email`, `phone`, `pass`, `score`, `article_count`, `collect_count`, `signature`, `role`, `status`, `avatar_url`)
VALUES
	(43,'2017-08-14 23:34:02','2017-08-19 00:46:33',NULL,'jack','liushen_shen@163.com','','1502981833498eac1501142f278c97f596df84c6e9',20,4,0,'',2,2,'');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table vote_items
# ------------------------------------------------------------

DROP TABLE IF EXISTS `vote_items`;

CREATE TABLE `vote_items` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `count` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `vote_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `vote_items` WRITE;
/*!40000 ALTER TABLE `vote_items` DISABLE KEYS */;

INSERT INTO `vote_items` (`id`, `name`, `count`, `created_at`, `updated_at`, `deleted_at`, `vote_id`)
VALUES
	(1,'golang',0,'2017-08-17 00:00:45','2017-08-17 00:00:45',NULL,2),
	(2,'java',0,'2017-08-17 00:00:45','2017-08-17 00:00:45',NULL,2),
	(3,'golang',0,'2017-08-17 00:01:39','2017-08-17 00:01:39',NULL,3),
	(4,'java',0,'2017-08-17 00:01:39','2017-08-17 00:01:39',NULL,3),
	(5,'golang',0,'2017-08-17 00:03:58','2017-08-17 00:03:58',NULL,4),
	(6,'java',0,'2017-08-17 00:03:58','2017-08-17 00:03:58',NULL,4),
	(7,'golang',0,'2017-08-17 00:05:30','2017-08-17 00:05:30',NULL,5),
	(8,'java',0,'2017-08-17 00:05:30','2017-08-17 00:05:30',NULL,5),
	(9,'golang',0,'2017-08-17 00:18:37','2017-08-17 00:18:37',NULL,6),
	(10,'java',0,'2017-08-17 00:18:37','2017-08-17 00:18:37',NULL,6),
	(11,'golang',0,'2017-08-17 00:18:52','2017-08-17 00:18:52',NULL,7),
	(12,'java',0,'2017-08-17 00:18:52','2017-08-17 00:18:52',NULL,7),
	(13,'golang',0,'2017-08-17 00:19:50','2017-08-17 00:19:50',NULL,8),
	(14,'java',0,'2017-08-17 00:19:50','2017-08-17 00:19:50',NULL,8),
	(15,'golang',0,'2017-08-17 00:21:08','2017-08-17 00:21:08',NULL,9),
	(16,'java',0,'2017-08-17 00:21:08','2017-08-17 00:21:08',NULL,9),
	(17,'golang',0,'2017-08-17 00:24:03','2017-08-17 00:24:03',NULL,10),
	(18,'java',0,'2017-08-17 00:24:03','2017-08-17 00:24:03',NULL,10),
	(19,'golang',0,'2017-08-17 00:24:36','2017-08-17 00:24:36',NULL,11),
	(20,'java',0,'2017-08-17 00:24:36','2017-08-17 00:24:36',NULL,11),
	(21,'golang',0,'2017-08-17 10:43:06','2017-08-17 10:43:06',NULL,12),
	(22,'java',0,'2017-08-17 10:43:06','2017-08-17 10:43:06',NULL,12),
	(23,'golang',0,'2017-08-17 10:45:23','2017-08-17 10:45:23',NULL,13),
	(24,'java',0,'2017-08-17 10:45:23','2017-08-17 10:45:23',NULL,13),
	(25,'golang',0,'2017-08-17 10:45:33','2017-08-17 10:45:33',NULL,14),
	(26,'java',0,'2017-08-17 10:45:33','2017-08-17 10:45:33',NULL,14),
	(27,'golang',0,'2017-08-17 10:53:18','2017-08-17 10:53:18',NULL,15),
	(28,'java',0,'2017-08-17 10:53:18','2017-08-17 10:53:18',NULL,15),
	(29,'golang',0,'2017-08-17 10:53:32','2017-08-17 10:53:32',NULL,16),
	(30,'java',0,'2017-08-17 10:53:32','2017-08-17 10:53:32',NULL,16),
	(31,'golang',0,'2017-08-17 11:13:27','2017-08-17 11:13:27',NULL,17),
	(32,'java',0,'2017-08-17 11:13:27','2017-08-17 11:13:27',NULL,17),
	(33,'golang',0,'2017-08-17 11:51:32','2017-08-17 11:51:32',NULL,18),
	(34,'java',0,'2017-08-17 11:51:32','2017-08-17 11:51:32',NULL,18),
	(35,'golang',0,'2017-08-17 14:41:55','2017-08-17 14:41:55',NULL,19),
	(36,'java',0,'2017-08-17 14:41:55','2017-08-17 14:41:55',NULL,19),
	(37,'golang',0,'2017-08-17 15:57:05','2017-08-17 15:57:05',NULL,20),
	(38,'java',0,'2017-08-17 15:57:05','2017-08-17 15:57:05',NULL,20),
	(39,'golang',0,'2017-08-17 16:04:32','2017-08-17 16:04:32',NULL,21),
	(40,'java',0,'2017-08-17 16:04:32','2017-08-17 16:04:32',NULL,21),
	(41,'golang',0,'2017-08-17 16:14:16','2017-08-17 16:14:16',NULL,22),
	(42,'java',0,'2017-08-17 16:14:16','2017-08-17 16:14:16',NULL,22),
	(43,'golang',0,'2017-08-17 16:22:38','2017-08-17 16:22:38',NULL,23),
	(44,'java',0,'2017-08-17 16:22:38','2017-08-17 16:22:38',NULL,23),
	(45,'golang',0,'2017-08-17 16:31:21','2017-08-17 16:31:21',NULL,24),
	(46,'java',0,'2017-08-17 16:31:21','2017-08-17 16:31:21',NULL,24),
	(47,'golang',0,'2017-08-17 17:24:20','2017-08-17 17:24:20',NULL,25),
	(48,'java',0,'2017-08-17 17:24:20','2017-08-17 17:24:20',NULL,25);

/*!40000 ALTER TABLE `vote_items` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table votes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `votes`;

CREATE TABLE `votes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL DEFAULT '',
  `browse_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `end_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;

INSERT INTO `votes` (`id`, `name`, `browse_count`, `comment_count`, `status`, `content`, `end_at`, `created_at`, `updated_at`, `deleted_at`, `user_id`)
VALUES
	(2,'adfaf',0,0,1,'adfaf','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(3,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(4,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(5,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(6,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(7,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(8,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(9,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(10,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(11,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(12,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(13,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(14,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(15,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(16,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(17,'a',0,0,1,'aaa','0000-00-00 00:00:00','0000-00-00 00:00:00','0000-00-00 00:00:00',NULL,43),
	(18,'a',0,0,1,'aaa','2017-08-20 23:40:01','2017-08-17 11:51:32','2017-08-17 11:51:32',NULL,43),
	(19,'b',0,0,1,'bb','2018-08-17 14:37:47','2017-08-17 14:41:55','2017-08-17 14:41:55',NULL,43),
	(20,'b',0,0,1,'bb','2018-02-05 06:44:31','2017-08-17 15:57:05','2017-08-17 15:57:05',NULL,43),
	(21,'b',0,0,2,'bb','2018-02-05 06:44:31','2017-08-17 16:04:32','2017-08-17 16:04:32',NULL,43),
	(22,'b',0,0,2,'bb','2018-02-05 06:44:31','2017-08-17 16:14:16','2017-08-17 16:14:16',NULL,43),
	(23,'b',0,0,2,'bb','2017-09-17 16:04:32','2017-08-17 16:22:38','2017-08-17 16:22:38',NULL,43),
	(24,'b',0,0,2,'bb','2017-09-17 16:04:31','2017-08-17 16:31:21','2017-08-17 16:31:21',NULL,43),
	(25,'c',0,0,2,'cc','2017-08-18 16:31:20','2017-08-17 17:24:20','2017-08-17 17:24:20',NULL,43);

/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
