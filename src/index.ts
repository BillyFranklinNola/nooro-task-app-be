import express from "express";
import cors from "cors";
import { tasksRouter } from "./routes/tasks";
import { prisma } from "./prisma";

const close = async () => {
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", close);
process.on("SIGTERM", close);

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/tasks", tasksRouter);

const port = Number(process.env.PORT ?? 4001);
app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on http://localhost:${port}`);
});
