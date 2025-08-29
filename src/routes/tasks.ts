import { Router } from "express";
import { prisma } from "../prisma"; 
export const tasksRouter = Router();

const allowedColors = new Set([
  "#FF3B30",
  "#FF9500",
  "#FFCC00",
  "#34C759",
  "#007AFF",
  "#5856D6",
  "#AF52DE",
  "#FF2D55",
  "#A2845E",
]);

tasksRouter.get("/", async (_req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { createdAt: "desc" } });
  res.json(tasks);
});

tasksRouter.post("/", async (req, res) => {
  try {
    const { title, color, completed = false } = req.body ?? {};
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!allowedColors.has(color)) {
      return res.status(400).json({ error: "Invalid color" });
    }
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        color,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });
    res.status(201).json(task);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

tasksRouter.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid id" });
    }
    const { title, color, completed } = req.body ?? {};
    const data: Record<string, any> = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return res.status(400).json({ error: "Invalid title" });
      }
      data.title = title.trim();
    }
    if (color !== undefined) {
      if (!allowedColors.has(color)) {
        return res.status(400).json({ error: "Invalid color" });
      }
      data.color = color;
    }
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Invalid completed flag" });
      }
      data.completed = completed;
      data.completedAt = completed ? new Date() : null;
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const task = await prisma.task.update({ where: { id }, data });
    res.json(task);
  } catch (e: any) {
    if (e?.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

tasksRouter.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid id" });
    }
    await prisma.task.delete({ where: { id } });
    res.status(204).end();
  } catch (e: any) {
    if (e?.code === "P2025") {
      return res.status(404).json({ error: "Task not found" });
    }
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
