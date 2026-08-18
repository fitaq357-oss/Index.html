ALTER TABLE `characterProfiles` DROP INDEX `characterProfiles_userId_unique`;--> statement-breakpoint
ALTER TABLE `characterProfiles` ADD `voiceName` varchar(80) DEFAULT 'Charon' NOT NULL;--> statement-breakpoint
ALTER TABLE `characterProfiles` ADD `isDefault` boolean DEFAULT false NOT NULL;