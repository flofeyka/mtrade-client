/*
  Warnings:

  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `promo_codes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_promoCodeId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_partnerId_fkey";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "promo_codes";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "SubscriptionType";
