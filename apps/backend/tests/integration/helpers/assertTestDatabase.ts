export const EXPECTED_TEST_DB_NAME = "flybook_test";

export function assertTestDatabaseUrl(
  url: string | undefined,
): asserts url is string {
  if (!url) {
    throw new Error(
      "DATABASE_URL_TEST is not set. Copy apps/backend/.env.test.example to apps/backend/.env.test first.",
    );
  }

  const dbName = new URL(url).pathname.replace(/^\//, "");

  if (dbName !== EXPECTED_TEST_DB_NAME) {
    throw new Error(
      `Refusing to run integration tests against database "${dbName}" — expected "${EXPECTED_TEST_DB_NAME}". This guard exists to prevent accidentally truncating the development database.`,
    );
  }
}
