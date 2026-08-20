import "dotenv/config";
import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import authRouter from "./src/routes/auth/auth.routes.ts";
import { ClientError } from "./exceptions/ClientError.ts";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/auth", authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- 4th param required so Express treats this as error-handling middleware
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.name, message: err.message },
    });
  }

  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan pada server" },
  });
});

export default app;
