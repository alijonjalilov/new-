-- Фото площадок для дизайна главной «Сцена»
CREATE TABLE "VenuePhoto" (
    "slot" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenuePhoto_pkey" PRIMARY KEY ("slot")
);
