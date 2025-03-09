CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `title` varchar(200) NOT NULL,
  `code_snippet` varchar(2000) NOT NULL,
  `answers` varchar(20) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `analysis` varchar(2000) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
--   KEY `FK_questions_user` (`user_id`),
--   CONSTRAINT `FK_questions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `question_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `option_value` char(1) NOT NULL,
  `option_desc` varchar(200) NOT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
--   KEY `FK_question_options_question` (`question_id`),
--   CONSTRAINT `FK_question_options_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;