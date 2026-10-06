/*
  Warnings:

  - You are about to drop the column `meetingTime` on the `Meeting` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `MeetingPlace` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `MeetingPlace` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `MeetingPlace` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MeetingTimePreference` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venue` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Interest" AS ENUM ('MEMES', 'TECH', 'MUSIC', 'MOVIES', 'GAMING', 'TRAVEL', 'FOOD', 'SPORTS', 'ANIME', 'READING', 'PHOTOGRAPHY', 'FITNESS', 'ART', 'DANCE', 'COOKING', 'CODING', 'FOOTBALL', 'CRICKET', 'TRAVELING', 'FASHION');

-- DropForeignKey
ALTER TABLE "MeetingTimePreference" DROP CONSTRAINT "MeetingTimePreference_placeId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingTimePreference" DROP CONSTRAINT "MeetingTimePreference_userId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "startDate" DATE NOT NULL,
ADD COLUMN     "venue" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "meetingTime";

-- AlterTable
ALTER TABLE "MeetingPlace" DROP COLUMN "description",
DROP COLUMN "latitude",
DROP COLUMN "longitude";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
ADD COLUMN     "about" TEXT,
ADD COLUMN     "interests" "Interest"[],
ADD COLUMN     "profilePic" TEXT;

-- DropTable
DROP TABLE "MeetingTimePreference";
