/*
 Navicat Premium Dump SQL

 Source Server         : mili
 Source Server Type    : MySQL
 Source Server Version : 50651 (5.6.51)
 Source Host           : localhost:3306
 Source Schema         : mili

 Target Server Type    : MySQL
 Target Server Version : 50651 (5.6.51)
 File Encoding         : 65001

 Date: 09/03/2025 00:04:26
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_category
-- ----------------------------
DROP TABLE IF EXISTS `article_category`;
CREATE TABLE `article_category` (
  `article_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`article_id`,`category_id`),
  KEY `idx_article_category_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of article_category
-- ----------------------------
BEGIN;
INSERT INTO `article_category` (`article_id`, `category_id`) VALUES (3, 1);
INSERT INTO `article_category` (`article_id`, `category_id`) VALUES (4, 1);
COMMIT;

-- ----------------------------
-- Table structure for article_collection
-- ----------------------------
DROP TABLE IF EXISTS `article_collection`;
CREATE TABLE `article_collection` (
  `article_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`article_id`,`collection_id`),
  KEY `idx_article_collection_collection_id` (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of article_collection
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for article_tag
-- ----------------------------
DROP TABLE IF EXISTS `article_tag`;
CREATE TABLE `article_tag` (
  `article_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`article_id`,`tag_id`),
  KEY `idx_article_tag_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of article_tag
-- ----------------------------
BEGIN;
INSERT INTO `article_tag` (`article_id`, `tag_id`) VALUES (3, 1);
INSERT INTO `article_tag` (`article_id`, `tag_id`) VALUES (4, 1);
COMMIT;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `last_comment_at` datetime DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `browse_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `root_comment_count` int(11) NOT NULL DEFAULT '0',
  `liked_count` int(11) NOT NULL DEFAULT '0',
  `word_count` int(11) NOT NULL DEFAULT '0',
  `hot` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `html_content` text COLLATE utf8mb4_unicode_ci,
  `summary` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content_type` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_articles_user_id` (`user_id`),
  KEY `idx_articles_created_at` (`created_at`),
  KEY `idx_articles_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of articles
-- ----------------------------
BEGIN;
INSERT INTO `articles` (`id`, `created_at`, `updated_at`, `deleted_at`, `last_comment_at`, `name`, `browse_count`, `comment_count`, `root_comment_count`, `liked_count`, `word_count`, `hot`, `status`, `content`, `html_content`, `summary`, `cover_url`, `content_type`, `user_id`) VALUES (3, '2025-03-08 23:13:30', '2025-03-08 23:13:30', NULL, NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 4, 0, 0, 0, 863, 0, 1, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n答复\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些大幅度发打撒发机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是单独参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。<br>答复<br>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些大幅度发打撒发机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是单独参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', '今年全国两会，人工智能是讨论热度最高的话题之一。 人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用', NULL, 1, 1);
INSERT INTO `articles` (`id`, `created_at`, `updated_at`, `deleted_at`, `last_comment_at`, `name`, `browse_count`, `comment_count`, `root_comment_count`, `liked_count`, `word_count`, `hot`, `status`, `content`, `html_content`, `summary`, `cover_url`, `content_type`, `user_id`) VALUES (4, '2025-03-08 23:49:46', '2025-03-08 23:49:46', NULL, NULL, '干货满满！一组图梳理“两高”工作报告', 0, 0, 0, 0, 515, 0, 1, '在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n``\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n', '<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓<br>``<br>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n', '在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。 “两高”工作报告有哪些主要内容，有什么亮点？一组图梳', NULL, 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for boilingpoint_comments
-- ----------------------------
DROP TABLE IF EXISTS `boilingpoint_comments`;
CREATE TABLE `boilingpoint_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `html_content` text,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `root_id` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `source_id` int(11) DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `liked_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `latest` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of boilingpoint_comments
-- ----------------------------
BEGIN;
INSERT INTO `boilingpoint_comments` (`id`, `html_content`, `parent_id`, `root_id`, `status`, `source_id`, `user_id`, `created_at`, `updated_at`, `deleted_at`, `liked_count`, `comment_count`, `latest`) VALUES (1, '<p>test</p>', 0, 0, 2, 1, 1, '2025-03-08 23:27:31', '2025-03-08 23:27:31', NULL, 0, 0, '[]');
COMMIT;

-- ----------------------------
-- Table structure for boilingpoint_reports
-- ----------------------------
DROP TABLE IF EXISTS `boilingpoint_reports`;
CREATE TABLE `boilingpoint_reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `boilingpoint_id` int(11) NOT NULL,
  `reason` tinyint(4) NOT NULL COMMENT '1、和话题不符 2、恶意攻击谩骂 3、广告营销 0、其它',
  `reporter` int(11) NOT NULL COMMENT '举报人',
  PRIMARY KEY (`id`),
  KEY `idx_boilingpoint_reports_boilingpoint_id` (`boilingpoint_id`),
  KEY `idx_boilingpoint_reports_reporter` (`reporter`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of boilingpoint_reports
-- ----------------------------
BEGIN;
INSERT INTO `boilingpoint_reports` (`id`, `created_at`, `boilingpoint_id`, `reason`, `reporter`) VALUES (1, '2025-03-08 23:27:48', 1, 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for boilingpoint_topics
-- ----------------------------
DROP TABLE IF EXISTS `boilingpoint_topics`;
CREATE TABLE `boilingpoint_topics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sequence` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of boilingpoint_topics
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for boilingpoints
-- ----------------------------
DROP TABLE IF EXISTS `boilingpoints`;
CREATE TABLE `boilingpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `browse_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `root_comment_count` int(11) NOT NULL DEFAULT '0',
  `liked_count` int(11) NOT NULL DEFAULT '0',
  `html_content` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imgs` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `topic_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_boilingpoints_topic_id` (`topic_id`),
  KEY `idx_boilingpoints_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of boilingpoints
-- ----------------------------
BEGIN;
INSERT INTO `boilingpoints` (`id`, `created_at`, `browse_count`, `comment_count`, `root_comment_count`, `liked_count`, `html_content`, `summary`, `imgs`, `topic_id`, `user_id`) VALUES (1, '2025-03-08 23:23:28', 0, 1, 1, 1, '<p>test</p>', 'test', '', 0, 1);
COMMIT;

-- ----------------------------
-- Table structure for book_categories
-- ----------------------------
DROP TABLE IF EXISTS `book_categories`;
CREATE TABLE `book_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sequence` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `pathname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_book_categories_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of book_categories
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for book_category
-- ----------------------------
DROP TABLE IF EXISTS `book_category`;
CREATE TABLE `book_category` (
  `book_id` int(11) NOT NULL,
  `book_category_id` int(11) NOT NULL,
  PRIMARY KEY (`book_id`,`book_category_id`),
  KEY `idx_book_category_category_id` (`book_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of book_category
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for book_chapter_comments
-- ----------------------------
DROP TABLE IF EXISTS `book_chapter_comments`;
CREATE TABLE `book_chapter_comments` (
  `id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of book_chapter_comments
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for book_chapters
-- ----------------------------
DROP TABLE IF EXISTS `book_chapters`;
CREATE TABLE `book_chapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `word_count` int(11) NOT NULL DEFAULT '0',
  `browse_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `root_comment_count` int(11) NOT NULL DEFAULT '0',
  `content` text COLLATE utf8mb4_unicode_ci,
  `html_content` text COLLATE utf8mb4_unicode_ci,
  `content_type` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_book_chapters_user_id` (`user_id`),
  KEY `idx_book_chapters_book_id` (`book_id`),
  KEY `idx_book_chapters_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of book_chapters
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for book_stars
-- ----------------------------
DROP TABLE IF EXISTS `book_stars`;
CREATE TABLE `book_stars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `html_content` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `star` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_book_stars_book_id` (`book_id`),
  KEY `idx_book_stars_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of book_stars
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for book_user_study
-- ----------------------------
DROP TABLE IF EXISTS `book_user_study`;
CREATE TABLE `book_user_study` (
  `user_id` int(11) unsigned NOT NULL,
  `book_id` int(11) unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`,`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of book_user_study
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for books
-- ----------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browse_count` int(11) NOT NULL DEFAULT '0',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `chapter_count` int(11) NOT NULL DEFAULT '0',
  `word_count` int(11) NOT NULL DEFAULT '0',
  `study_user_count` int(11) NOT NULL DEFAULT '0' COMMENT '已学习过此书的人数',
  `cover_url` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL,
  `star_user_count` int(11) NOT NULL DEFAULT '0' COMMENT '评价过图书的人数',
  `star` int(11) NOT NULL DEFAULT '0',
  `content` text COLLATE utf8mb4_unicode_ci,
  `html_content` text COLLATE utf8mb4_unicode_ci,
  `content_type` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_books_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of books
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sequence` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `follower_count` int(11) NOT NULL COMMENT '有多少人关注',
  `article_count` int(11) NOT NULL COMMENT '有多少人关注',
  `pathname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of categories
-- ----------------------------
BEGIN;
INSERT INTO `categories` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `sequence`, `parent_id`, `follower_count`, `article_count`, `pathname`) VALUES (1, '2025-03-08 23:11:38', '2025-03-08 23:11:53', NULL, '分类1', 0, 0, 0, 2, 'fenlei1');
INSERT INTO `categories` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `sequence`, `parent_id`, `follower_count`, `article_count`, `pathname`) VALUES (2, '2025-03-08 23:39:18', '2025-03-08 23:39:18', NULL, '分类2', 0, 0, 0, 0, 'fenlei2');
COMMIT;

-- ----------------------------
-- Table structure for collection_admins
-- ----------------------------
DROP TABLE IF EXISTS `collection_admins`;
CREATE TABLE `collection_admins` (
  `collection_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`collection_id`,`user_id`),
  KEY `IDX_collection_admin_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of collection_admins
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for collection_contributors
-- ----------------------------
DROP TABLE IF EXISTS `collection_contributors`;
CREATE TABLE `collection_contributors` (
  `collection_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`collection_id`,`user_id`),
  KEY `IDX_collection_contributor_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of collection_contributors
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for collection_followers
-- ----------------------------
DROP TABLE IF EXISTS `collection_followers`;
CREATE TABLE `collection_followers` (
  `collection_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`collection_id`,`user_id`),
  KEY `IDX_collection_follower_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of collection_followers
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for collections
-- ----------------------------
DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `article_count` int(11) NOT NULL COMMENT '收录的文章数',
  `follower_count` int(11) NOT NULL COMMENT '有多少人关注此专题',
  `announcement` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '专题公告',
  `allow_post` tinyint(1) NOT NULL COMMENT '是否允许投稿',
  `post_must_audit` tinyint(1) NOT NULL COMMENT '投稿是否需要审核',
  `cover_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '封面',
  `creator_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_collection_creator` (`creator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of collections
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `html_content` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `root_id` int(11) NOT NULL,
  `latest` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '最近的两条子评论',
  `comment_count` int(11) NOT NULL COMMENT '子评论数',
  `liked_count` int(11) NOT NULL COMMENT '点赞数',
  `source_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_comment_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of comments
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for contributor_collection
-- ----------------------------
DROP TABLE IF EXISTS `contributor_collection`;
CREATE TABLE `contributor_collection` (
  `user_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`collection_id`),
  KEY `IDX_collection_id` (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户投稿的专题表';

-- ----------------------------
-- Records of contributor_collection
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for crawler_articles
-- ----------------------------
DROP TABLE IF EXISTS `crawler_articles`;
CREATE TABLE `crawler_articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of crawler_articles
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for draft_category
-- ----------------------------
DROP TABLE IF EXISTS `draft_category`;
CREATE TABLE `draft_category` (
  `draft_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`draft_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of draft_category
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for draft_tag
-- ----------------------------
DROP TABLE IF EXISTS `draft_tag`;
CREATE TABLE `draft_tag` (
  `draft_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`draft_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of draft_tag
-- ----------------------------
BEGIN;
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (5, 1);
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (6, 1);
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (7, 1);
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (8, 1);
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (9, 1);
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (10, 1);
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (11, 1);
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (12, 1);
INSERT INTO `draft_tag` (`draft_id`, `tag_id`) VALUES (13, 1);
COMMIT;

-- ----------------------------
-- Table structure for drafts
-- ----------------------------
DROP TABLE IF EXISTS `drafts`;
CREATE TABLE `drafts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `word_count` int(11) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `html_content` text COLLATE utf8mb4_unicode_ci,
  `content_type` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of drafts
-- ----------------------------
BEGIN;
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (1, '2025-03-08 23:03:47', '2025-03-08 23:03:47', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 0, '', '', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (2, '2025-03-08 23:03:49', '2025-03-08 23:03:49', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 121, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (3, '2025-03-08 23:03:53', '2025-03-08 23:03:53', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 0, '', '', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (4, '2025-03-08 23:03:55', '2025-03-08 23:03:55', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 121, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (5, '2025-03-08 23:07:17', '2025-03-08 23:07:17', NULL, '他儿', 0, '', '', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (6, '2025-03-08 23:07:19', '2025-03-08 23:07:19', NULL, '他儿', 121, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (7, '2025-03-08 23:07:21', '2025-03-08 23:07:21', NULL, '他儿', 853, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (8, '2025-03-08 23:07:25', '2025-03-08 23:07:25', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 853, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (9, '2025-03-08 23:07:35', '2025-03-08 23:07:35', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 854, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是d参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是d参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (10, '2025-03-08 23:07:37', '2025-03-08 23:07:37', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 857, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是单独  ~~~~参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是单独  <del>~</del>参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (11, '2025-03-08 23:07:39', '2025-03-08 23:07:39', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 863, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些da\'f机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是单独参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些da&#39;f机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是单独参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (12, '2025-03-08 23:07:41', '2025-03-08 23:07:41', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 862, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些大幅度发打撒发机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是单独参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些大幅度发打撒发机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是单独参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (13, '2025-03-08 23:07:43', '2025-03-08 23:07:43', NULL, '小经跑两会｜人工智能，如何更好赋能千行百业', 863, '今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n答复\n人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些大幅度发打撒发机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n今年全国两会，人工智能是讨论热度最高的话题之一。\n\n人工智能时代呼啸而至，我们每个人都是见证者，也是单独参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。\n\n', '<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。<br>答复<br>人工智能时代呼啸而至，我们每个人都是见证者，也是参与者。人工智能发展带来哪些大幅度发打撒发机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n<p>今年全国两会，人工智能是讨论热度最高的话题之一。</p>\n<p>人工智能时代呼啸而至，我们每个人都是见证者，也是单独参与者。人工智能发展带来哪些机遇与挑战？给我们的生产、生活带来什么变化？如何更好发挥人工智能技术的作用？让我们听听两会上代表委员们是怎么说的吧。</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (14, '2025-03-08 23:48:28', '2025-03-08 23:48:28', NULL, '干货满满！一组图梳理“两高”工作报告', 0, '', '', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (15, '2025-03-08 23:48:30', '2025-03-08 23:48:30', NULL, '干货满满！一组图梳理“两高”工作报告', 514, '在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n', '<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n', 1, 1);
INSERT INTO `drafts` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `word_count`, `content`, `html_content`, `content_type`, `user_id`) VALUES (16, '2025-03-08 23:48:32', '2025-03-08 23:48:32', NULL, '干货满满！一组图梳理“两高”工作报告', 515, '在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n``\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。\n\n“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓\n\n', '<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓<br>``<br>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n<p>在今天的十四届全国人大三次会议第二次全体会议上，最高人民法院院长张军作了最高人民法院工作报告，最高人民检察院检察长应勇作了最高人民检察院工作报告。</p>\n<p>“两高”工作报告有哪些主要内容，有什么亮点？一组图梳理↓</p>\n', 1, 1);
COMMIT;

-- ----------------------------
-- Table structure for follower_category
-- ----------------------------
DROP TABLE IF EXISTS `follower_category`;
CREATE TABLE `follower_category` (
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`category_id`),
  KEY `IDX_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注分类表';

-- ----------------------------
-- Records of follower_category
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for follower_collection
-- ----------------------------
DROP TABLE IF EXISTS `follower_collection`;
CREATE TABLE `follower_collection` (
  `user_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`collection_id`),
  KEY `IDX_collection_id` (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注的专题表';

-- ----------------------------
-- Records of follower_collection
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for handbook_categories
-- ----------------------------
DROP TABLE IF EXISTS `handbook_categories`;
CREATE TABLE `handbook_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sequence` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of handbook_categories
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for handbook_chapters
-- ----------------------------
DROP TABLE IF EXISTS `handbook_chapters`;
CREATE TABLE `handbook_chapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `browse_count` int(11) NOT NULL,
  `comment_count` int(11) NOT NULL,
  `root_comment_count` int(11) NOT NULL,
  `try_read` tinyint(1) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `html_content` text COLLATE utf8mb4_unicode_ci,
  `word_count` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of handbook_chapters
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for handbooks
-- ----------------------------
DROP TABLE IF EXISTS `handbooks`;
CREATE TABLE `handbooks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `introduce` text COLLATE utf8mb4_unicode_ci,
  `summary` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `author_intro` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(11) NOT NULL,
  `completion_at` datetime NOT NULL,
  `is_all_done` tinyint(1) NOT NULL,
  `is_agree` tinyint(1) NOT NULL,
  `cover_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `word_count` int(11) NOT NULL,
  `sale_count` int(11) NOT NULL,
  `comment_count` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of handbooks
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for hankbook_chapter_comments
-- ----------------------------
DROP TABLE IF EXISTS `hankbook_chapter_comments`;
CREATE TABLE `hankbook_chapter_comments` (
  `id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of hankbook_chapter_comments
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for images
-- ----------------------------
DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `url` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int(11) NOT NULL COMMENT '单位字节',
  `format` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of images
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for like_articles
-- ----------------------------
DROP TABLE IF EXISTS `like_articles`;
CREATE TABLE `like_articles` (
  `user_id` int(11) unsigned NOT NULL,
  `article_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of like_articles
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for like_boilingpoints
-- ----------------------------
DROP TABLE IF EXISTS `like_boilingpoints`;
CREATE TABLE `like_boilingpoints` (
  `user_id` int(11) unsigned NOT NULL,
  `boilingpoint_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`boilingpoint_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of like_boilingpoints
-- ----------------------------
BEGIN;
INSERT INTO `like_boilingpoints` (`user_id`, `boilingpoint_id`, `created_at`, `publisher`) VALUES (1, 1, '2025-03-08 23:25:13', '1');
COMMIT;

-- ----------------------------
-- Table structure for post_message
-- ----------------------------
DROP TABLE IF EXISTS `post_message`;
CREATE TABLE `post_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of post_message
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for question_options
-- ----------------------------
DROP TABLE IF EXISTS `question_options`;
CREATE TABLE `question_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `option_value` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_desc` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of question_options
-- ----------------------------
BEGIN;
INSERT INTO `question_options` (`id`, `option_value`, `option_desc`, `question_id`) VALUES (1, 'A', 'adfadsf', 1);
INSERT INTO `question_options` (`id`, `option_value`, `option_desc`, `question_id`) VALUES (2, 'B', 'adfasdf', 1);
INSERT INTO `question_options` (`id`, `option_value`, `option_desc`, `question_id`) VALUES (3, 'C', 'adsfasdf', 1);
COMMIT;

-- ----------------------------
-- Table structure for questions
-- ----------------------------
DROP TABLE IF EXISTS `questions`;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_snippet` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answers` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` tinyint(4) NOT NULL,
  `analysis` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of questions
-- ----------------------------
BEGIN;
INSERT INTO `questions` (`id`, `created_at`, `updated_at`, `title`, `code_snippet`, `answers`, `type`, `analysis`, `user_id`) VALUES (1, '2025-03-08 23:42:16', '2025-03-08 23:42:16', 'sa\'d\'f', 'daf', 'A', 1, 'adsfasdf', 1);
COMMIT;

-- ----------------------------
-- Table structure for settings
-- ----------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `editor_type` int(11) NOT NULL COMMENT '编辑器类型',
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户设置表';

-- ----------------------------
-- Records of settings
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for tag_category
-- ----------------------------
DROP TABLE IF EXISTS `tag_category`;
CREATE TABLE `tag_category` (
  `tag_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`tag_id`,`category_id`),
  KEY `IDX_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签分类关联表';

-- ----------------------------
-- Records of tag_category
-- ----------------------------
BEGIN;
INSERT INTO `tag_category` (`tag_id`, `category_id`) VALUES (1, 1);
COMMIT;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `follower_count` int(11) NOT NULL DEFAULT '0' COMMENT '被多少人关注',
  `article_count` int(11) NOT NULL DEFAULT '0',
  `icon_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ----------------------------
-- Records of tags
-- ----------------------------
BEGIN;
INSERT INTO `tags` (`id`, `created_at`, `updated_at`, `name`, `follower_count`, `article_count`, `icon_url`) VALUES (1, '2025-03-08 23:05:53', '2025-03-08 23:05:56', '标签1', 1, 2, NULL);
COMMIT;

-- ----------------------------
-- Table structure for timeline
-- ----------------------------
DROP TABLE IF EXISTS `timeline`;
CREATE TABLE `timeline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '事件类型：publish_comment-发表评论,publish_article-发表文章,up_comment-赞了评论,link_article-喜欢文章,follow_user-关注作者,join-加入',
  `article_title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户时间线表';

-- ----------------------------
-- Records of timeline
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user_collection
-- ----------------------------
DROP TABLE IF EXISTS `user_collection`;
CREATE TABLE `user_collection` (
  `user_id` int(11) NOT NULL,
  `collection_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`collection_id`),
  KEY `IDX_collection_id` (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户创建的专题表';

-- ----------------------------
-- Records of user_collection
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user_followed_categories
-- ----------------------------
DROP TABLE IF EXISTS `user_followed_categories`;
CREATE TABLE `user_followed_categories` (
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`category_id`),
  KEY `IDX_category_followers` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of user_followed_categories
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user_follower
-- ----------------------------
DROP TABLE IF EXISTS `user_follower`;
CREATE TABLE `user_follower` (
  `user_id` int(11) unsigned NOT NULL,
  `follower_id` int(11) unsigned NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`follower_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user_follower
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for user_subscribed_tag
-- ----------------------------
DROP TABLE IF EXISTS `user_subscribed_tag`;
CREATE TABLE `user_subscribed_tag` (
  `user_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`,`tag_id`),
  KEY `IDX_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户关注标签表';

-- ----------------------------
-- Records of user_subscribed_tag
-- ----------------------------
BEGIN;
INSERT INTO `user_subscribed_tag` (`user_id`, `tag_id`, `created_at`) VALUES (1, 1, '2025-03-08 23:34:40');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `activated_at` datetime DEFAULT NULL COMMENT '账号激活时间',
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pass` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` int(11) NOT NULL DEFAULT '0' COMMENT '米粒值',
  `article_count` int(11) NOT NULL DEFAULT '0',
  `article_view_count` int(11) NOT NULL DEFAULT '0' COMMENT '文章被阅读的次数',
  `comment_count` int(11) NOT NULL DEFAULT '0',
  `word_count` int(11) NOT NULL DEFAULT '0' COMMENT '写了多少字',
  `boilingpoint_count` int(11) NOT NULL DEFAULT '0' COMMENT '沸点数量',
  `follow_count` int(11) NOT NULL DEFAULT '0' COMMENT '关注了多少人',
  `follower_count` int(11) NOT NULL DEFAULT '0' COMMENT '被多少人关注',
  `follow_tag_count` int(11) NOT NULL DEFAULT '0' COMMENT '关注了多少个标签',
  `liked_count` int(11) NOT NULL DEFAULT '0' COMMENT '获得多少个赞',
  `u_like_count` int(11) NOT NULL DEFAULT '0' COMMENT '用户一共点了多少个赞',
  `u_article_like_count` int(11) NOT NULL DEFAULT '0' COMMENT '用户对文章点了多少个赞',
  `u_bp_like_count` int(11) NOT NULL DEFAULT '0' COMMENT '用户对沸点点了多少个赞',
  `collection_count` int(11) NOT NULL DEFAULT '0' COMMENT '收藏集的个数',
  `role` int(11) NOT NULL COMMENT '角色',
  `status` int(11) NOT NULL COMMENT '用户状态',
  `avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '头像',
  `sex` tinyint(4) NOT NULL,
  `job` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `introduce` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '个人介绍',
  `personal_hp` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '个人主页',
  `github_id` int(11) DEFAULT NULL,
  `github_avatar_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github_login` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weibo_id` int(11) DEFAULT NULL,
  `weibo_screen_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weibo_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weibo_avatar_large` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `activated_at`, `username`, `email`, `phone`, `pass`, `value`, `article_count`, `article_view_count`, `comment_count`, `word_count`, `boilingpoint_count`, `follow_count`, `follower_count`, `follow_tag_count`, `liked_count`, `u_like_count`, `u_article_like_count`, `u_bp_like_count`, `collection_count`, `role`, `status`, `avatar_url`, `sex`, `job`, `company`, `introduce`, `personal_hp`, `github_id`, `github_avatar_url`, `github_login`, `github_name`, `weibo_id`, `weibo_screen_name`, `weibo_name`, `weibo_avatar_large`, `location`) VALUES (1, '2025-03-08 23:03:09', '2025-03-08 23:03:09', NULL, '2025-03-08 23:03:09', '13544443333', '', '13544443333', '7b34f0d982ec0a016e520d2cd5ea2180331dc759f2', 0, 2, 4, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 4, 2, '/static/images/avatar.jpg', 2, '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for usertrack
-- ----------------------------
DROP TABLE IF EXISTS `usertrack`;
CREATE TABLE `usertrack` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referrer` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_id` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ua` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_width` int(11) DEFAULT NULL,
  `device_height` int(11) DEFAULT NULL,
  `browser_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser_version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_model` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `os_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `os_version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为追踪表';

-- ----------------------------
-- Records of usertrack
-- ----------------------------
BEGIN;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
