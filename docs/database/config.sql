CREATE DATABASE `koalify`;

CREATE TABLE `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `questionId` int(11) NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  `value` varchar(45) DEFAULT NULL,
  `correctAnswer` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_answers_questions1_idx` (`questionId`),
  CONSTRAINT `fk_answers_questions1` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `accentColor` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

CREATE TABLE `challenges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `brief` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `icon` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_challenges_categories_idx` (`categoryId`),
  CONSTRAINT `fk_challenges_categories` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `checkpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `challengeId` int(11) NOT NULL,
  `description` varchar(45) DEFAULT NULL,
  `technologies` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_checkpoints_challenges1_idx` (`challengeId`),
  CONSTRAINT `fk_checkpoints_challenges1` FOREIGN KEY (`challengeId`) REFERENCES `challenges` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `level` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `remote` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `responsabilities` varchar(45) DEFAULT NULL,
  `compensations` varchar(45) DEFAULT NULL,
  `requirements` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_jobs_categories1_idx` (`categoryId`),
  CONSTRAINT `fk_jobs_categories1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `opponents` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `level` enum('EASY','MEDIUM','HARD') DEFAULT NULL,
  `personality` enum('PRACTICAL','THEORICAL','SPECIALIST') DEFAULT NULL,
  `about` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `challengeId` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `type` enum('PRACTICAL','THEORICAL') DEFAULT NULL,
  `level` enum('EASY','MEDIUM','HARD') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_questions_challenges1_idx` (`challengeId`),
  CONSTRAINT `fk_questions_challenges1` FOREIGN KEY (`challengeId`) REFERENCES `challenges` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `references` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `checkpointId` int(11) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `link` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_references_checkpoints1_idx` (`checkpointId`),
  CONSTRAINT `fk_references_checkpoints1` FOREIGN KEY (`checkpointId`) REFERENCES `checkpoints` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
