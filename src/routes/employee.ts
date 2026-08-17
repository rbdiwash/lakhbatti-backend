import { Router } from "express";
import { prisma } from "../lib/prisma.ts";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const email = data.contact.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingEmployee = await prisma.employeeRegistration.findUnique({
      where: { email },
    });
    if (existingEmployee) {
      return res.status(400).json({ error: "Employee already exists" });
    }

    const record = await prisma.employeeRegistration.create({
      data: {
        email,
        ...data,
      },
    });
    return res.status(201).json({
      id: record.id,
      message: "Employee registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

router.get("/list", async (req, res) => {
  try {
    const records = await prisma.employeeRegistration.findMany();
    return res.status(200).json({
      data: {
        data: records,
        total: records.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(records.length / 10),
      },
      message: "Employees fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await prisma.employeeRegistration.findUnique({
      where: { id },
    });
    if (!record) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.status(200).json({
      data: record,
      message: "Employee fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const record = await prisma.employeeRegistration.update({
      where: { id },
      data,
    });
    if (!record) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.status(200).json({
      data: record,
      message: "Employee updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Internal Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await prisma.employeeRegistration.delete({
      where: { id },
    });
    if (!record) {
      return res.status(404).json({ error: "Employee not found" });
    }
    return res.status(200).json({
      data: record,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Internal Server Error",
    });
  }
});
export default router;
