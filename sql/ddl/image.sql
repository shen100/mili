CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `width` int(11) NOT NULL,
  `height` int(11) NOT NULL,
  `url` varchar(200) NOT NULL,
  `mime` varchar(50) NOT NULL,
  `size` int(11) NOT NULL COMMENT '单位字节',
  `format` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;