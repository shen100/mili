# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.35)
# Database: golang123
# Generation Time: 2017-09-03 08:58:37 +0000
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
	(52,33,15),
	(53,32,12),
	(74,34,12),
	(75,35,13),
	(76,36,15),
	(84,37,13),
	(85,38,13),
	(86,39,13),
	(87,40,14),
	(88,41,15),
	(89,42,13),
	(90,43,13),
	(95,44,12),
	(97,46,14),
	(98,45,12),
	(99,47,15),
	(100,48,14),
	(101,49,15),
	(102,50,12),
	(103,51,12),
	(104,52,13),
	(105,53,12),
	(106,54,13),
	(107,55,12),
	(108,56,13),
	(109,57,13),
	(110,58,13),
	(111,59,13),
	(112,60,13),
	(113,61,12),
	(114,62,12),
	(115,63,12);

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
  `collect_count` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `last_user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;

INSERT INTO `articles` (`id`, `name`, `browse_count`, `comment_count`, `collect_count`, `status`, `content`, `created_at`, `updated_at`, `deleted_at`, `user_id`, `last_user_id`)
VALUES
	(45,'a',52,2,0,1,'```\n<template>\n    <div>\n        <app-header :user=\"user\" />\n        <div class=\"golang-home-body\">\n            <div class=\"golang-home-body-left\">\n                <div class=\"detail-title-box\">\n                    <p class=\"vote-detail-title\"><span class=\"vote-categoties\" :class=\"status ? \'vote-categoties-running\' : \'vote-categoties-end\'\">{{status ? \'进行中\' : \'已结束\'}}</span>{{vote.name}}</p>\n                    <p class=\"vote-title-info\">\n                        <span class=\"vote-title-info-item\">\n                            发布于{{vote.createdAt | getReplyTime}}\n                        </span>\n                        <span class=\"vote-title-info-item\">\n                            作者{{vote.user.name}}\n                        </span>\n                        <span class=\"vote-title-info-item\">\n                            {{vote.browseCount}}次浏览\n                        </span>\n                    </p>\n                </div>\n                <div class=\"home-vote-box\">\n                    <div class=\"golang123-editor\" v-html=\"vote.content\"></div>\n                    <div class=\"\">\n                        <span v-for=\"item in vote.voteItems\">\n                            <Button type=\"primary\" class=\"vote-item\" @click=\"onVoteSubmit(item.id)\">支持<span class=\"vote-item-label\">{{item.name}}</span><span class=\"vote-item-label\">{{item.count}}</span></Button>\n                        </span>\n                    </div>\n                    <div class=\"vote-actions\">\n                        <div class=\"vote-share\">\n                            <div class=\"vote-share-btn\">\n                                <Icon type=\"android-star-outline\" style=\"font-size: 20px;margin-top:-2px;\"></Icon>\n                                <span>收藏</span>\n                            </div>\n                            <div class=\"vote-share-btn\">\n                                <Icon type=\"android-share-alt\" style=\"font-size: 16px\"></Icon>\n                                <span>分享</span>\n                            </div>\n                            <template v-if=\"isAuthor\">\n                                <div class=\"vote-share-btn\">\n                                    <Icon type=\"edit\" style=\"font-size: 16px\"></Icon>\n                                    <a :href=\"\'/topic/edit/\' + vote.id\"><span>编辑</span></a>\n                                </div>\n                                <div class=\"vote-share-btn\">\n                                    <Icon type=\"android-delete\" style=\"font-size: 17px;\"></Icon>\n                                    <span @click=\"onDelete\">删除</span>\n                                </div>\n                            </template>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"golang-cell comment-box\">\n                    <div class=\"title\">{{vote.commentCount > 0 ? vote.commentCount : \'暂无\'}}回复</div>\n                    <div class=\"comment-content\">\n                        <template v-if=\"vote.commentCount\">\n                            <div class=\"comment-item\" v-for=\"(item, index) in vote.comments\">\n                                <a class=\"reply-user-icon\">\n                                    <img src=\"~assets/images/head.png\" alt=\"\">\n                                </a>\n                                <a class=\"reply-user-name\">{{item.user.name}}</a>\n                                <span class=\"reply-time\">{{index + 1}}楼•{{item.createdAt | getReplyTime}}</span>\n                                <div class=\"golang123-editor\" v-html=\"item.content\"></div>\n                            </div>\n                        </template>\n                        <p class=\"not-signin\" v-if=\"!vote.commentCount && user\">暂时还没有人回复过这个投票</p>\n                        <p class=\"not-signin\" v-if=\"!vote.commentCount && !user\">暂时还没有人回复过这个投票,&nbsp;要回复投票, 请先&nbsp;<a @click=\"onSignin\">登录</a>&nbsp;或&nbsp;<a href=\"/signup\">注册</a></p>\n                        <p class=\"not-signin not-signin-border\" v-if=\"vote.commentCount && !user\">要回复投票, 请先&nbsp;<a @click=\"onSignin\">登录</a>&nbsp;或&nbsp;<a href=\"/signup\">注册</a></p>\n                    </div>\n                </div>\n                <div class=\"golang-cell comment-box\" v-if=\"user\">\n                    <div class=\"title\">添加回复</div>\n                    <div class=\"comment-content\">\n                        <Form ref=\"formData\" :model=\"formData\" :rules=\"formRule\">\n                            <Form-item prop=\"content\">\n                                <md-editor :value=\"formData.content\" @change=\"onContentChage\" />\n                            </Form-item>\n                        </Form>\n                        <Button type=\"primary\" @click=\"onSubmit\">发表回复</Button>\n                    </div>\n                </div>\n            </div>\n            <app-sidebar :score=\"score\" :votesMaxBrowse=\"votesMaxBrowse\" :votesMaxComment=\"votesMaxComment\"/>\n        </div>\n        <app-footer />\n    </div>\n</template>\n\n<script>\n    import ErrorCode from \'~/constant/ErrorCode\'\n    import VoteStatus from \'~/constant/VoteStatus\'\n    import Header from \'~/components/Header\'\n    import Footer from \'~/components/Footer\'\n    import Sidebar from \'~/components/Sidebar\'\n    import editor from \'~/components/article/editor\'\n    import request from \'~/net/request\'\n    import dateTool from \'~/utils/date\'\n\n    export default {\n        data () {\n            return {\n                loading: false,\n                formData: {\n                    content: \'\'\n                },\n                formRule: {\n                    content: [\n                        { required: true, message: \'请输入回复内容\', trigger: \'blur\' }\n                    ]\n                }\n            }\n        },\n        validate ({ params }) {\n            var hasId = !!params.id\n            return hasId\n        },\n        asyncData (context) {\n            return Promise.all([\n                request.getVote({\n                    client: context.req,\n                    params: {\n                        id: context.params.id\n                    }\n                }),\n                request.getVoteMaxBrowse({\n                    client: context.req\n                }),\n                request.getVoteMaxComment({\n                    client: context.req\n                }),\n                request.getTop10({\n                    client: context.req\n                })\n            ]).then(arr => {\n                let vote = arr[0].data\n                let votesMaxBrowse = arr[1].data.votes\n                let votesMaxComment = arr[2].data.votes\n                let score = arr[3].data.users\n                let isAuthor = context.user && context.user.id === vote.user.id\n                return {\n                    isAuthor: isAuthor,\n                    vote: vote,\n                    user: context.user,\n                    votesMaxBrowse: votesMaxBrowse,\n                    votesMaxComment: votesMaxComment,\n                    score: score,\n                    status: vote.status === VoteStatus.VOTE_UNDERWAY\n                }\n            }).catch(err => {\n                console.log(err)\n                context.error({ statusCode: 404, message: \'Page not found\' })\n            })\n        },\n        middleware: \'userInfo\',\n        methods: {\n            onSignin () {\n                location.href = \'/signin?ref=\' + encodeURIComponent(location.href)\n            },\n            onDelete () {\n                let self = this\n                this.$Modal.confirm({\n                    title: \'删除投票\',\n                    content: \'确认删除这个投票?\',\n                    onOk () {\n                        request.deleteVote({\n                            params: {\n                                id: self.vote.id\n                            }\n                        }).then(res => {\n                            if (res.errNo === ErrorCode.SUCCESS) {\n                                self.$Message.success(\'已删除!\')\n                                setTimeout(function () {\n                                    location.href = \'/vote\'\n                                }, 500)\n                            } else {\n                                self.$Message.error(res.msg)\n                            }\n                        }).catch(err => {\n                            err = \'内部错误\'\n                            self.$Message.error(err)\n                        })\n                    },\n                    onCancel () {\n\n                    }\n                })\n            },\n            onContentChage (content) {\n                this.formData.content = content\n            },\n            onSubmit () {\n                this.$refs[\'formData\'].validate((valid) => {\n                    if (!this.loading && valid) {\n                        this.loading = true\n                        request.commentCreate({\n                            body: {\n                                sourceID: parseInt(this.$route.params.id),\n                                parentID: 0,\n                                content: this.formData.content,\n                                sourceName: \'vote\'\n                            }\n                        }).then(res => {\n                            if (res.errNo === ErrorCode.SUCCESS) {\n                                this.formData.content = \'\'\n                                this.$Message.success(\'评论提交成功\')\n                                return request.getVote({\n                                    params: {\n                                        id: this.$route.params.id\n                                    }\n                                })\n                            } else {\n                                return Promise.reject(new Error(res.msg))\n                            }\n                        }).then(res => {\n                            if (res.errNo === ErrorCode.SUCCESS) {\n                                this.vote = res.data\n                            }\n                        }).catch(err => {\n                            this.loading = false\n                            this.$Message.error(err.message)\n                        })\n                    }\n                })\n            },\n            onVoteSubmit (id) {\n                if (!this.loading) {\n                    this.loading = true\n                    request.userVote({\n                        params: {\n                            id: id\n                        }\n                    }).then(res => {\n                        this.loading = false\n                        if (res.errNo === ErrorCode.SUCCESS) {\n                            return request.getVote({\n                                params: {\n                                    id: this.$route.params.id\n                                }\n                            })\n                        } else {\n                            return Promise.reject(new Error(res.msg))\n                        }\n                    }).then(res => {\n                        if (res.errNo === ErrorCode.SUCCESS) {\n                            this.vote = res.data\n                            this.$Message.success(\'投票成功\')\n                        }\n                    }).catch(err => {\n                        this.loading = false\n                        this.$Message.error(err.message)\n                    })\n                }\n            }\n        },\n        mounted () {\n        },\n        head () {\n            return {\n                title: this.vote.name,\n                link: [\n                    { rel: \'stylesheet\', href: \'/styles/editor/simplemde.min.css\' }\n                ]\n            }\n        },\n        filters: {\n            getReplyTime: dateTool.getReplyTime\n        },\n        components: {\n            \'app-header\': Header,\n            \'app-footer\': Footer,\n            \'app-sidebar\': Sidebar,\n            \'md-editor\': editor\n        }\n    }\n</script>\n\n<style>\n    @import \'~assets/styles/vote/detail.css\'\n</style>\n\n```','2017-09-01 21:52:57','2017-09-02 00:42:38',NULL,63,63),
	(46,'aaa',3,0,0,1,'aa','2017-09-01 23:21:02','2017-09-01 23:22:12','2017-09-01 23:22:14',63,0),
	(47,'aew',1,0,0,1,'sdfsaf','2017-09-02 00:21:47','2017-09-02 00:21:47',NULL,63,0),
	(48,'adsfasfd',6,0,0,1,'asdf','2017-09-02 00:22:19','2017-09-02 00:44:08',NULL,63,0),
	(49,'asdfaf',2,0,0,1,'asdf','2017-09-02 00:22:34','2017-09-02 00:25:32',NULL,63,0),
	(50,'adsf',0,0,0,1,'asdf','2017-09-02 15:31:55','2017-09-02 15:31:55',NULL,64,0),
	(51,'aa222',0,0,0,1,'af','2017-09-02 15:32:34','2017-09-02 15:32:34',NULL,64,0),
	(52,'dfaf',0,0,0,1,'adsfasf','2017-09-02 15:33:36','2017-09-02 15:33:36',NULL,64,0),
	(53,'adsf',5,0,0,1,'asfaf','2017-09-02 15:38:08','2017-09-02 17:25:34',NULL,64,0),
	(54,'a2',1,0,0,1,'asdfasf','2017-09-02 15:40:28','2017-09-03 16:11:00',NULL,64,0),
	(55,'aaa',0,0,0,1,'adsfaf','2017-09-02 15:41:01','2017-09-02 15:41:01',NULL,64,0),
	(56,'aaa',0,0,0,1,'asdf','2017-09-02 15:42:02','2017-09-02 15:42:02',NULL,64,0),
	(57,'a',0,0,0,1,'adsfaf','2017-09-02 15:43:19','2017-09-02 15:43:19',NULL,64,0),
	(58,'a',42,0,0,1,'adsfaf','2017-09-02 15:43:43','2017-09-02 16:15:35',NULL,64,0),
	(59,'a',0,0,0,1,'adsfaf','2017-09-02 15:43:45','2017-09-02 15:43:45',NULL,64,0),
	(60,'a',0,0,1,1,'adsfaf','2017-09-02 15:43:46','2017-09-03 15:33:09',NULL,64,0),
	(61,'a3',9,0,6,1,'asfd','2017-09-02 15:44:50','2017-09-03 15:38:56',NULL,64,0),
	(62,'aaaa的文章',4,0,5,1,'aaaa','2017-09-03 15:56:42','2017-09-03 16:19:23',NULL,64,0),
	(63,'test的文章',2,0,10,1,'asdfaf','2017-09-03 15:57:02','2017-09-03 16:20:49',NULL,63,0);

/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;


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

LOCK TABLES `careers` WRITE;
/*!40000 ALTER TABLE `careers` DISABLE KEYS */;

INSERT INTO `careers` (`id`, `created_at`, `updated_at`, `deleted_at`, `company`, `title`, `user_id`)
VALUES
	(1,'2017-09-02 21:13:22','2017-09-02 21:13:22','2017-09-02 21:34:44','酷六网','高级flash工程师',63);

/*!40000 ALTER TABLE `careers` ENABLE KEYS */;
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
	(12,'分享','',0,0,1,'2017-08-23 11:32:19','2017-09-03 15:57:02',NULL),
	(13,'提问','',0,0,1,'2017-08-23 11:32:41','2017-09-02 15:43:46',NULL),
	(14,'招聘','',0,0,1,'2017-08-23 11:32:47','2017-09-02 00:22:19',NULL),
	(15,'头条','',0,0,1,'2017-08-24 10:14:52','2017-09-02 00:22:34',NULL),
	(16,'test','',0,0,1,'2017-08-25 23:14:53','2017-08-25 23:14:53',NULL);

/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;


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

LOCK TABLES `collects` WRITE;
/*!40000 ALTER TABLE `collects` DISABLE KEYS */;

INSERT INTO `collects` (`id`, `user_id`, `created_at`, `updated_at`, `deleted_at`, `source_id`, `source_name`, `folder_id`)
VALUES
	(34,63,'2017-09-03 16:42:15','2017-09-03 16:42:15',NULL,39,'collect_source_vote',2),
	(35,63,'2017-09-03 16:42:40','2017-09-03 16:42:40',NULL,40,'collect_source_vote',2);

/*!40000 ALTER TABLE `collects` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(10000) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `up_count` int(11) NOT NULL DEFAULT '0',
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

INSERT INTO `comments` (`id`, `content`, `parent_id`, `status`, `up_count`, `source_id`, `source_name`, `user_id`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(55,'aaa',0,1,0,45,'article',63,'2017-09-01 23:30:27','2017-09-01 23:30:27',NULL),
	(56,'测试下',0,1,0,45,'article',63,'2017-09-01 23:30:46','2017-09-01 23:30:46',NULL),
	(57,'测试下\n测试下\n测试下\n测试下a\nadf\n测试下adfaf',0,1,0,45,'article',63,'2017-09-01 23:30:58','2017-09-01 23:30:58',NULL),
	(58,'aaa',0,1,0,36,'vote',63,'2017-09-01 23:38:08','2017-09-01 23:38:08',NULL),
	(59,'```\n </template>\n                        <p class=\"not-signin\" v-if=\"!vote.commentCount && user\">暂时还没有人回复过这个投票</p>\n                        <p class=\"not-signin\" v-if=\"!vote.commentCount && !user\">暂时还没有人回复过这个投票,&nbsp;要回复投票, 请先&nbsp;<a @click=\"onSignin\">登录</a>&nbsp;或&nbsp;<a href=\"/signup\">注册</a></p>\n                        <p class=\"not-signin not-signin-border\" v-if=\"vote.commentCount && !user\">要回复投票, 请先&nbsp;<a @click=\"onSignin\">登录</a>&nbsp;或&nbsp;<a href=\"/signup\">注册</a></p>\n```',0,1,0,36,'vote',63,'2017-09-01 23:47:19','2017-09-01 23:47:19',NULL),
	(60,'b',0,1,0,37,'vote',63,'2017-09-01 23:48:02','2017-09-01 23:48:02',NULL),
	(61,'abc',0,1,0,45,'article',63,'2017-09-02 00:18:12','2017-09-02 00:18:12',NULL),
	(62,'eee',0,1,0,45,'article',63,'2017-09-02 00:18:17','2017-09-02 00:18:17',NULL),
	(63,'ccc\neee\nddd\naaaa',0,1,0,36,'vote',63,'2017-09-02 00:18:48','2017-09-02 00:18:48',NULL);

/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;


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

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;

INSERT INTO `folders` (`id`, `user_id`, `created_at`, `updated_at`, `deleted_at`, `name`, `parent_id`)
VALUES
	(2,63,'2017-09-03 12:13:48','2017-09-03 16:42:40',NULL,'a',0),
	(3,63,'2017-09-03 15:34:53','2017-09-03 15:36:15',NULL,'b',2),
	(4,63,'2017-09-03 15:38:36','2017-09-03 15:38:56',NULL,'bb',2);

/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
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



# Dump of table messages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
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

LOCK TABLES `schools` WRITE;
/*!40000 ALTER TABLE `schools` DISABLE KEYS */;

INSERT INTO `schools` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `speciality`, `user_id`)
VALUES
	(2,'2017-09-02 21:07:15','2017-09-02 21:07:15','2017-09-02 21:39:13','武汉工程大学','计算机科学与技术',63);

/*!40000 ALTER TABLE `schools` ENABLE KEYS */;
UNLOCK TABLES;


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
  `name` varchar(100) NOT NULL DEFAULT '',
  `email` varchar(50) NOT NULL DEFAULT '',
  `phone` varchar(50) DEFAULT NULL,
  `pass` varchar(100) NOT NULL DEFAULT '',
  `score` int(11) unsigned NOT NULL,
  `article_count` int(11) unsigned NOT NULL,
  `comment_count` int(11) NOT NULL,
  `collect_count` int(11) unsigned NOT NULL,
  `signature` varchar(200) DEFAULT NULL,
  `role` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `avatar_url` varchar(500) NOT NULL DEFAULT '',
  `sex` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `location` varchar(200) DEFAULT NULL,
  `introduce` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `email`, `phone`, `pass`, `score`, `article_count`, `comment_count`, `collect_count`, `signature`, `role`, `status`, `avatar_url`, `sex`, `location`, `introduce`)
VALUES
	(63,'2017-09-01 19:37:56','2017-09-03 16:42:40',NULL,'test','liushen_shen@163.com','','1504265876004495c7611526b233fce80021f5d735',1,2,9,27,'',3,2,'/images/avatar/1.png',0,'abcdddddd',''),
	(64,'2017-09-02 14:57:17','2017-09-03 16:42:40',NULL,'aaaa','a@qq.com','','1504335437cf4a0cb3a77b5a5a4f2a337adc64a97d',8,0,0,0,'',3,2,'/images/avatar/0.png',0,NULL,NULL),
	(65,'2017-09-02 22:10:18','2017-09-03 16:26:44',NULL,'abcd','saf@qq.com','','150436141873eec14e3058a1632de3c74d0ad63da5',3,0,0,0,'',1,1,'/images/avatar/1.png',0,'',''),
	(66,'2017-09-02 22:22:57','2017-09-03 16:26:44',NULL,'wang6756','wang6756@163.com','','1504362177f34b5bdb6afe8468f34c80ef045e6e53',4,0,0,0,'',1,1,'/images/avatar/0.png',0,'','');

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
	(69,'a',0,'2017-09-01 23:34:26','2017-09-01 23:34:26',NULL,36),
	(70,'b',0,'2017-09-01 23:34:26','2017-09-01 23:34:26',NULL,36),
	(71,'adsf',0,'2017-09-01 23:47:56','2017-09-01 23:47:56',NULL,37),
	(72,'sadf',0,'2017-09-01 23:47:56','2017-09-01 23:47:56',NULL,37),
	(73,'a',0,'2017-09-01 23:51:57','2017-09-01 23:51:57',NULL,38),
	(74,'b',0,'2017-09-01 23:51:57','2017-09-01 23:51:57',NULL,38),
	(75,'a',0,'2017-09-03 16:23:54','2017-09-03 16:23:54',NULL,39),
	(76,'b',0,'2017-09-03 16:23:54','2017-09-03 16:23:54',NULL,39),
	(77,'asdfaf',0,'2017-09-03 16:24:26','2017-09-03 16:24:26',NULL,40),
	(78,'asdfaf',0,'2017-09-03 16:24:26','2017-09-03 16:24:26',NULL,40);

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
  `collect_count` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `end_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  `user_id` int(11) unsigned NOT NULL,
  `last_user_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;

INSERT INTO `votes` (`id`, `name`, `browse_count`, `comment_count`, `collect_count`, `status`, `content`, `end_at`, `created_at`, `updated_at`, `deleted_at`, `user_id`, `last_user_id`)
VALUES
	(34,'tttt',29,0,0,1,'aaa','2017-09-06 00:00:00','2017-09-01 21:52:37','2017-09-01 22:18:18','2017-09-01 22:18:31',63,0),
	(35,'asdfa',3,0,0,1,'adfas','2017-09-13 00:00:00','2017-09-01 23:21:23','2017-09-01 23:21:34','2017-09-01 23:21:41',63,0),
	(36,'aa',25,3,0,1,'adf','2017-09-06 00:00:00','2017-09-01 23:34:26','2017-09-02 00:18:48',NULL,63,63),
	(37,'aaaaa',6,1,0,1,'aaa','2017-09-13 00:00:00','2017-09-01 23:47:56','2017-09-02 00:30:04',NULL,63,63),
	(38,'aaccc',3,0,0,1,'```\n<template>\n    <div>\n        <app-header :user=\"user\" />\n        <div class=\"golang-home-body\">\n            <div class=\"golang-home-body-left\">\n                <div class=\"detail-title-box\">\n                    <p class=\"vote-detail-title\"><span class=\"vote-categoties\" :class=\"status ? \'vote-categoties-running\' : \'vote-categoties-end\'\">{{status ? \'进行中\' : \'已结束\'}}</span>{{vote.name}}</p>\n                    <p class=\"vote-title-info\">\n                        <span class=\"vote-title-info-item\">\n                            发布于{{vote.createdAt | getReplyTime}}\n                        </span>\n                        <span class=\"vote-title-info-item\">\n                            作者{{vote.user.name}}\n                        </span>\n                        <span class=\"vote-title-info-item\">\n                            {{vote.browseCount}}次浏览\n                        </span>\n                    </p>\n                </div>\n                <div class=\"home-vote-box\">\n                    <div class=\"golang123-editor\" v-html=\"vote.content\"></div>\n                    <div class=\"\">\n                        <span v-for=\"item in vote.voteItems\">\n                            <Button type=\"primary\" class=\"vote-item\" @click=\"onVoteSubmit(item.id)\">支持<span class=\"vote-item-label\">{{item.name}}</span><span class=\"vote-item-label\">{{item.count}}</span></Button>\n                        </span>\n                    </div>\n                    <div class=\"vote-actions\">\n                        <div class=\"vote-share\">\n                            <div class=\"vote-share-btn\">\n                                <Icon type=\"android-star-outline\" style=\"font-size: 20px;margin-top:-2px;\"></Icon>\n                                <span>收藏</span>\n                            </div>\n                            <div class=\"vote-share-btn\">\n                                <Icon type=\"android-share-alt\" style=\"font-size: 16px\"></Icon>\n                                <span>分享</span>\n                            </div>\n                            <template v-if=\"isAuthor\">\n                                <div class=\"vote-share-btn\">\n                                    <Icon type=\"edit\" style=\"font-size: 16px\"></Icon>\n                                    <a :href=\"\'/topic/edit/\' + vote.id\"><span>编辑</span></a>\n                                </div>\n                                <div class=\"vote-share-btn\">\n                                    <Icon type=\"android-delete\" style=\"font-size: 17px;\"></Icon>\n                                    <span @click=\"onDelete\">删除</span>\n                                </div>\n                            </template>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"golang-cell comment-box\">\n                    <div class=\"title\">{{vote.commentCount > 0 ? vote.commentCount : \'暂无\'}}回复</div>\n                    <div class=\"comment-content\">\n                        <template v-if=\"vote.commentCount\">\n                            <div class=\"comment-item\" v-for=\"(item, index) in vote.comments\">\n                                <a class=\"reply-user-icon\">\n                                    <img src=\"~assets/images/head.png\" alt=\"\">\n                                </a>\n                                <a class=\"reply-user-name\">{{item.user.name}}</a>\n                                <span class=\"reply-time\">{{index + 1}}楼•{{item.createdAt | getReplyTime}}</span>\n                                <div class=\"golang123-editor\" v-html=\"item.content\"></div>\n                            </div>\n                        </template>\n                        <p class=\"not-signin\" v-if=\"!vote.commentCount && user\">暂时还没有人回复过这个投票</p>\n                        <p class=\"not-signin\" v-if=\"!vote.commentCount && !user\">暂时还没有人回复过这个投票,&nbsp;要回复投票, 请先&nbsp;<a @click=\"onSignin\">登录</a>&nbsp;或&nbsp;<a href=\"/signup\">注册</a></p>\n                        <p class=\"not-signin not-signin-border\" v-if=\"vote.commentCount && !user\">要回复投票, 请先&nbsp;<a @click=\"onSignin\">登录</a>&nbsp;或&nbsp;<a href=\"/signup\">注册</a></p>\n                    </div>\n                </div>\n                <div class=\"golang-cell comment-box\" v-if=\"user\">\n                    <div class=\"title\">添加回复</div>\n                    <div class=\"comment-content\">\n                        <Form ref=\"formData\" :model=\"formData\" :rules=\"formRule\">\n                            <Form-item prop=\"content\">\n                                <md-editor :value=\"formData.content\" @change=\"onContentChage\" />\n                            </Form-item>\n                        </Form>\n                        <Button type=\"primary\" @click=\"onSubmit\">发表回复</Button>\n                    </div>\n                </div>\n            </div>\n            <app-sidebar :score=\"score\" :votesMaxBrowse=\"votesMaxBrowse\" :votesMaxComment=\"votesMaxComment\"/>\n        </div>\n        <app-footer />\n    </div>\n</template>\n\n<script>\n    import ErrorCode from \'~/constant/ErrorCode\'\n    import VoteStatus from \'~/constant/VoteStatus\'\n    import Header from \'~/components/Header\'\n    import Footer from \'~/components/Footer\'\n    import Sidebar from \'~/components/Sidebar\'\n    import editor from \'~/components/article/editor\'\n    import request from \'~/net/request\'\n    import dateTool from \'~/utils/date\'\n\n    export default {\n        data () {\n            return {\n                loading: false,\n                formData: {\n                    content: \'\'\n                },\n                formRule: {\n                    content: [\n                        { required: true, message: \'请输入回复内容\', trigger: \'blur\' }\n                    ]\n                }\n            }\n        },\n        validate ({ params }) {\n            var hasId = !!params.id\n            return hasId\n        },\n        asyncData (context) {\n            return Promise.all([\n                request.getVote({\n                    client: context.req,\n                    params: {\n                        id: context.params.id\n                    }\n                }),\n                request.getVoteMaxBrowse({\n                    client: context.req\n                }),\n                request.getVoteMaxComment({\n                    client: context.req\n                }),\n                request.getTop10({\n                    client: context.req\n                })\n            ]).then(arr => {\n                let vote = arr[0].data\n                let votesMaxBrowse = arr[1].data.votes\n                let votesMaxComment = arr[2].data.votes\n                let score = arr[3].data.users\n                let isAuthor = context.user && context.user.id === vote.user.id\n                return {\n                    isAuthor: isAuthor,\n                    vote: vote,\n                    user: context.user,\n                    votesMaxBrowse: votesMaxBrowse,\n                    votesMaxComment: votesMaxComment,\n                    score: score,\n                    status: vote.status === VoteStatus.VOTE_UNDERWAY\n                }\n            }).catch(err => {\n                console.log(err)\n                context.error({ statusCode: 404, message: \'Page not found\' })\n            })\n        },\n        middleware: \'userInfo\',\n        methods: {\n            onSignin () {\n                location.href = \'/signin?ref=\' + encodeURIComponent(location.href)\n            },\n            onDelete () {\n                let self = this\n                this.$Modal.confirm({\n                    title: \'删除投票\',\n                    content: \'确认删除这个投票?\',\n                    onOk () {\n                        request.deleteVote({\n                            params: {\n                                id: self.vote.id\n                            }\n                        }).then(res => {\n                            if (res.errNo === ErrorCode.SUCCESS) {\n                                self.$Message.success(\'已删除!\')\n                                setTimeout(function () {\n                                    location.href = \'/vote\'\n                                }, 500)\n                            } else {\n                                self.$Message.error(res.msg)\n                            }\n                        }).catch(err => {\n                            err = \'内部错误\'\n                            self.$Message.error(err)\n                        })\n                    },\n                    onCancel () {\n\n                    }\n                })\n            },\n            onContentChage (content) {\n                this.formData.content = content\n            },\n            onSubmit () {\n                this.$refs[\'formData\'].validate((valid) => {\n                    if (!this.loading && valid) {\n                        this.loading = true\n                        request.commentCreate({\n                            body: {\n                                sourceID: parseInt(this.$route.params.id),\n                                parentID: 0,\n                                content: this.formData.content,\n                                sourceName: \'vote\'\n                            }\n                        }).then(res => {\n                            if (res.errNo === ErrorCode.SUCCESS) {\n                                this.formData.content = \'\'\n                                this.$Message.success(\'评论提交成功\')\n                                return request.getVote({\n                                    params: {\n                                        id: this.$route.params.id\n                                    }\n                                })\n                            } else {\n                                return Promise.reject(new Error(res.msg))\n                            }\n                        }).then(res => {\n                            if (res.errNo === ErrorCode.SUCCESS) {\n                                this.vote = res.data\n                            }\n                        }).catch(err => {\n                            this.loading = false\n                            this.$Message.error(err.message)\n                        })\n                    }\n                })\n            },\n            onVoteSubmit (id) {\n                if (!this.loading) {\n                    this.loading = true\n                    request.userVote({\n                        params: {\n                            id: id\n                        }\n                    }).then(res => {\n                        this.loading = false\n                        if (res.errNo === ErrorCode.SUCCESS) {\n                            return request.getVote({\n                                params: {\n                                    id: this.$route.params.id\n                                }\n                            })\n                        } else {\n                            return Promise.reject(new Error(res.msg))\n                        }\n                    }).then(res => {\n                        if (res.errNo === ErrorCode.SUCCESS) {\n                            this.vote = res.data\n                            this.$Message.success(\'投票成功\')\n                        }\n                    }).catch(err => {\n                        this.loading = false\n                        this.$Message.error(err.message)\n                    })\n                }\n            }\n        },\n        mounted () {\n        },\n        head () {\n            return {\n                title: this.vote.name,\n                link: [\n                    { rel: \'stylesheet\', href: \'/styles/editor/simplemde.min.css\' }\n                ]\n            }\n        },\n        filters: {\n            getReplyTime: dateTool.getReplyTime\n        },\n        components: {\n            \'app-header\': Header,\n            \'app-footer\': Footer,\n            \'app-sidebar\': Sidebar,\n            \'md-editor\': editor\n        }\n    }\n</script>\n\n<style>\n    @import \'~assets/styles/vote/detail.css\'\n</style>\n\n```','2017-09-14 00:00:00','2017-09-01 23:51:57','2017-09-01 23:55:51',NULL,63,0),
	(39,'test的投票',4,0,7,1,'asdfaf','2017-09-14 00:00:00','2017-09-03 16:23:54','2017-09-03 16:42:15',NULL,63,0),
	(40,'aaaa的投票',3,0,4,1,'asdfaf','2017-09-15 00:00:00','2017-09-03 16:24:26','2017-09-03 16:42:40',NULL,64,0);

/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
