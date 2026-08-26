import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  CabinClass,
  SeatStatus,
} from "../generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function atHour(daysFromNow: number, hour: number, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date;
}

const flightsData = [
  {
    airlineName: "Garuda Indonesia",
    flightNumber: "GA400",
    originAirport: "CGK",
    destinationAirport: "DPS",
    departureTime: atHour(1, 7, 0),
    arrivalTime: atHour(1, 9, 30),
  },
  {
    airlineName: "Lion Air",
    flightNumber: "JT610",
    originAirport: "CGK",
    destinationAirport: "SUB",
    departureTime: atHour(1, 10, 15),
    arrivalTime: atHour(1, 11, 45),
  },
  {
    airlineName: "Batik Air",
    flightNumber: "ID6800",
    originAirport: "DPS",
    destinationAirport: "CGK",
    departureTime: atHour(2, 13, 0),
    arrivalTime: atHour(2, 15, 30),
  },
  {
    airlineName: "Citilink",
    flightNumber: "QG800",
    originAirport: "SUB",
    destinationAirport: "CGK",
    departureTime: atHour(3, 6, 30),
    arrivalTime: atHour(3, 8, 0),
  },
];

const seatPlan: { seatClass: CabinClass; price: number; count: number }[] = [
  { seatClass: CabinClass.ECONOMY, price: 850_000, count: 6 },
  { seatClass: CabinClass.BUSINESS, price: 2_500_000, count: 3 },
  { seatClass: CabinClass.FIRST_CLASS, price: 5_000_000, count: 2 },
];

const columns = ["A", "B", "C", "D", "E", "F"];

async function main() {
  await prisma.seat.deleteMany();
  await prisma.flight.deleteMany();

  for (const flightData of flightsData) {
    const flight = await prisma.flight.create({ data: flightData });

    let row = 1;
    for (const plan of seatPlan) {
      for (let i = 0; i < plan.count; i++) {
        const column = columns[i % columns.length];
        await prisma.seat.create({
          data: {
            flightId: flight.id,
            seatNumber: `${row}${column}`,
            seatClass: plan.seatClass,
            price: plan.price,
            status: i === 0 ? SeatStatus.OCCUPIED : SeatStatus.AVAILABLE,
          },
        });
        if (column === columns[columns.length - 1]) row++;
      }
      row++;
    }
  }

  console.log(`Seeded ${flightsData.length} flights with seats.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
