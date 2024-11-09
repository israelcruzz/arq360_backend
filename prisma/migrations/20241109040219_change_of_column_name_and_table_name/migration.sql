/*
  Warnings:

  - You are about to drop the column `accessToken` on the `authorization_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "authorization_tokens" DROP COLUMN "accessToken";
