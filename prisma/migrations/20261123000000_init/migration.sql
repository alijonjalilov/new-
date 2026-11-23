-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'CONFERENCE', 'CORPORATE', 'BIRTHDAY', 'OFFICIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CONTACTED', 'CONFIRMED', 'REJECTED');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "eventType" "EventType" NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'NEW',
    "eventDate" DATE,
    "eventTime" TEXT,
    "city" TEXT,
    "address" TEXT,
    "guests" TEXT,
    "language" TEXT,
    "answers" JSONB NOT NULL,
    "clientName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "email" TEXT,
    "comment" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_number_key" ON "Booking"("number");

-- CreateIndex
CREATE INDEX "Booking_eventType_idx" ON "Booking"("eventType");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "Booking_eventDate_idx" ON "Booking"("eventDate");
