-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentStatus" ADD VALUE 'FAILED';
ALTER TYPE "PaymentStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'UAH',
ADD COLUMN     "externalData" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "partnerCode" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'manual',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "telegram" TEXT;
