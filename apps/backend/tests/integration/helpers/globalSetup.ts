import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import { Client } from "pg";
import {
  assertTestDatabaseUrl,
  EXPECTED_TEST_DB_NAME,
} from "./assertTestDatabase.ts";

const backendRoot = fileURLToPath(new URL("../../..", import.meta.url));

export default async function globalSetup(): Promise<void> {
  if (!process.env.DATABASE_URL_TEST) {
    dotenv.config({ path: path.join(backendRoot, ".env.test") });
  }

  assertTestDatabaseUrl(process.env.DATABASE_URL_TEST);
  const testDatabaseUrl = process.env.DATABASE_URL_TEST;

  const adminUrl = new URL(testDatabaseUrl);
  adminUrl.pathname = "/postgres";

  const adminClient = new Client({ connectionString: adminUrl.toString() });
  await adminClient.connect();
  try {
    await adminClient.query(`CREATE DATABASE "${EXPECTED_TEST_DB_NAME}"`);
  } catch (err) {
    if ((err as { code?: string }).code !== "42P04") {
      throw err;
    }
  } finally {
    await adminClient.end();
  }

  process.env.DATABASE_URL = testDatabaseUrl;

  execSync("npx prisma migrate deploy", {
    cwd: backendRoot,
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
    stdio: "inherit",
  });
}
