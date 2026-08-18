CREATE TABLE `contentItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(240) NOT NULL,
	`body` text NOT NULL,
	`pillar` enum('AI & Automation','Social Media Management','Content Pipeline','Freelance Business') NOT NULL,
	`platform` enum('YouTube','Instagram','TikTok','Facebook','LinkedIn') NOT NULL,
	`format` enum('Caption','Hook','Script','Post Copy') NOT NULL,
	`status` enum('Idea','Draft','Ready','Published') NOT NULL DEFAULT 'Idea',
	`scheduledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentStrategies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`targetAudience` text NOT NULL,
	`subtopics` text NOT NULL,
	`postingGoals` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentStrategies_id` PRIMARY KEY(`id`),
	CONSTRAINT `contentStrategies_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `researchReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pillar` enum('AI & Automation','Social Media Management','Content Pipeline','Freelance Business') NOT NULL,
	`audience` varchar(240) NOT NULL,
	`focus` text,
	`report` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `researchReports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contentItems` ADD CONSTRAINT `contentItems_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentStrategies` ADD CONSTRAINT `contentStrategies_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `researchReports` ADD CONSTRAINT `researchReports_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `contentItems_userId_idx` ON `contentItems` (`userId`);--> statement-breakpoint
CREATE INDEX `contentItems_schedule_idx` ON `contentItems` (`userId`,`scheduledAt`);--> statement-breakpoint
CREATE INDEX `contentStrategies_userId_idx` ON `contentStrategies` (`userId`);--> statement-breakpoint
CREATE INDEX `researchReports_userId_idx` ON `researchReports` (`userId`);