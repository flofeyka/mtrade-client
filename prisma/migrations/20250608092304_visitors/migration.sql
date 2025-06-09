/*
  Warnings:

  - You are about to drop the column `location` on the `visitors` table. All the data in the column will be lost.
  - Added the required column `browser` to the `visitors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cookieFile` to the `visitors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `visitors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeOnSite` to the `visitors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trafficSource` to the `visitors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `visitors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "visitors" DROP COLUMN "location",
ADD COLUMN     "browser" TEXT NOT NULL,
ADD COLUMN     "cookieFile" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pagesViewed" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "timeOnSite" TEXT NOT NULL,
ADD COLUMN     "trafficSource" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "utmTags" TEXT;
