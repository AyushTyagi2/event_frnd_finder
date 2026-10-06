/*
  Warnings:

  - Added the required column `recipientId` to the `Meeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesterId` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "recipientAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recipientId" UUID NOT NULL,
ADD COLUMN     "requesterAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requesterId" UUID NOT NULL;
