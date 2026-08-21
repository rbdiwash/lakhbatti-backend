import { Router } from "express";
import { prisma } from "../lib/prisma.ts";

const router = Router();

const JOB_STATUSES = [
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

router.get("/", async (_req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      data: jobs,
      message: "Jobs fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      address,
      suburb,
      state,
      postcode,
      scheduledDate,
      startTime,
      endTime,
      payRate,
      notes,
      employeeId,
    } = req.body ?? {};

    if (!title?.trim()) {
      return res.status(400).json({ message: "Job title is required." });
    }
    if (!category?.trim()) {
      return res.status(400).json({ message: "Job category is required." });
    }

    if (employeeId) {
      const employee = await prisma.employeeRegistration.findUnique({
        where: { id: employeeId },
        select: { id: true },
      });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }
    }

    const job = await prisma.job.create({
      data: {
        title: String(title).trim(),
        category: String(category).trim(),
        description: String(description ?? "").trim(),
        address: String(address ?? "").trim(),
        suburb: String(suburb ?? "").trim(),
        state: String(state ?? "NSW").trim(),
        postcode: String(postcode ?? "").trim(),
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        startTime: String(startTime ?? "").trim(),
        endTime: String(endTime ?? "").trim(),
        payRate: String(payRate ?? "").trim(),
        notes: String(notes ?? "").trim(),
        employeeId: employeeId || null,
        status: employeeId ? "ASSIGNED" : "OPEN",
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      data: job,
      message: "Job created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, employeeId } = req.body ?? {};

    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (status && !JOB_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid job status." });
    }

    if (employeeId) {
      const employee = await prisma.employeeRegistration.findUnique({
        where: { id: employeeId },
        select: { id: true },
      });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }
    }

    const nextEmployeeId =
      employeeId === undefined ? existing.employeeId : employeeId || null;
    const nextStatus =
      status ??
      (nextEmployeeId && existing.status === "OPEN"
        ? "ASSIGNED"
        : existing.status);

    const job = await prisma.job.update({
      where: { id },
      data: {
        status: nextStatus,
        employeeId: nextEmployeeId,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return res.status(200).json({
      data: job,
      message: "Job updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

export default router;
