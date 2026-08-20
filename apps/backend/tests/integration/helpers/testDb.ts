import { prisma } from "../../../lib/prisma.ts";
import { assertTestDatabaseUrl } from "./assertTestDatabase.ts";

export async function resetDatabase(): Promise<void> {
  assertTestDatabaseUrl(process.env.DATABASE_URL);
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "users" RESTART IDENTITY CASCADE',
  );
}
