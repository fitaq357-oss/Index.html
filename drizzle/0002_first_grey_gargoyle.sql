CREATE TABLE `characterProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`identitySummary` text NOT NULL,
	`appearance` text NOT NULL,
	`wardrobe` text NOT NULL,
	`voiceoverDirection` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `characterProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `characterProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `characterProfiles` ADD CONSTRAINT `characterProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `characterProfiles_userId_idx` ON `characterProfiles` (`userId`);