-- CreateEnum
CREATE TYPE "CabinClass" AS ENUM ('ECONOMY', 'BUSINESS', 'FIRST_CLASS');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'OCCUPIED');

-- CreateTable
CREATE TABLE "flights" (
    "id" TEXT NOT NULL,
    "airlineName" VARCHAR(100) NOT NULL,
    "flightNumber" VARCHAR(20) NOT NULL,
    "originAirport" VARCHAR(3) NOT NULL,
    "destinationAirport" VARCHAR(3) NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" TEXT NOT NULL,
    "flightId" TEXT NOT NULL,
    "seatNumber" VARCHAR(10) NOT NULL,
    "seatClass" "CabinClass" NOT NULL DEFAULT 'ECONOMY',
    "price" DECIMAL(12,2) NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "flights_flightNumber_departureTime_key" ON "flights"("flightNumber", "departureTime");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flights"("id") ON DELETE CASCADE ON UPDATE CASCADE;
