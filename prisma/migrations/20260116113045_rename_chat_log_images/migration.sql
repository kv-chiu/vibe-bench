/*
  Warnings:

  - You are about to drop the column `chatLogImages` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "chatLogImages",
ADD COLUMN     "chatLogFiles" TEXT[];
