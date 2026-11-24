-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "extraPhones" TEXT[] DEFAULT ARRAY[]::TEXT[];
