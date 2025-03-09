DROP TABLE IF EXISTS `usertrack`;

CREATE TABLE `usertrack` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `platform` varchar(50) NOT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `referrer` varchar(2000) DEFAULT NULL,
  `client_id` varchar(200) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `ua` varchar(500) DEFAULT NULL,
  `device_width` int(11) DEFAULT NULL,
  `device_height` int(11) DEFAULT NULL,
  `browser_name` varchar(50) DEFAULT NULL,
  `browser_version` varchar(50) DEFAULT NULL,
  `device_model` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `language` varchar(50) DEFAULT NULL,
  `os_name` varchar(50) DEFAULT NULL,
  `os_version` varchar(50) DEFAULT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为追踪表';