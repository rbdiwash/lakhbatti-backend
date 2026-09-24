import { Router } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.ts";
import { asBool, asList, asString } from "../helper/helper.ts";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const data = req.body;
    const email = data?.email?.trim().toLowerCase();
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
      data: record,
      message: "Employee registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      message: error?.message ?? "Internal Server Error",
    });
  }
});

router.get("/check", async (req, res) => {
  const email = String(req.query.email ?? "")
    .trim()
    .toLowerCase();
  if (!email) return res.status(400).json({ exists: false });

  const existing = await prisma.employeeRegistration.findUnique({
    where: { email },
    select: { id: true },
  });

  return res.json({ exists: Boolean(existing) });
});

router.get("/list", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(req.query.pageSize) || 10),
    );

    const search = asString(req.query.search);
    const status = asString(req.query.status);
    const workType = asString(req.query.workType);
    const visaStatus = asString(req.query.visaStatus);
    const preferredDays = asList(req.query.preferredDays);
    const minPay = asString(req.query.minPay);
    const maxPay = asString(req.query.maxPay);
    const willingToTravel = asBool(req.query.willingToTravel);
    const hasDriverLicense = asBool(req.query.hasDriverLicense);
    const hasPoliceCheck = asBool(req.query.hasPoliceCheck);
    const hasWorkingWithChildren = asBool(req.query.hasWorkingWithChildren);
    const yearsExperience = asString(req.query.yearsExperience);
    const preferredTimeSlots = asList(req.query.preferredTimeSlots);

    const where: Prisma.EmployeeRegistrationWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { suburb: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
        { postcode: { contains: search, mode: "insensitive" } },
        { expectedPayRate: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status as
        | "PENDING"
        | "REVIEWING"
        | "APPROVED"
        | "REJECTED";
    }
    if (workType) where.workType = workType;
    if (visaStatus) where.visaStatus = visaStatus;
    if (preferredDays.length) {
      where.preferredDays = { hasSome: preferredDays };
    }
    if (preferredTimeSlots.length) {
      where.preferredTimeSlots = { hasSome: preferredTimeSlots };
    }
    if (willingToTravel !== undefined) where.willingToTravel = willingToTravel;
    if (hasDriverLicense !== undefined) {
      where.hasDriverLicense = hasDriverLicense;
    }
    if (hasPoliceCheck !== undefined) where.hasPoliceCheck = hasPoliceCheck;
    if (hasWorkingWithChildren !== undefined) {
      where.hasWorkingWithChildren = hasWorkingWithChildren;
    }
    if (yearsExperience) where.yearsExperience = yearsExperience;

    const [records, total] = await Promise.all([
      prisma.employeeRegistration.findMany({
        where,
        include: { _count: { select: { jobs: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.employeeRegistration.count({ where }),
    ]);

    return res.status(200).json({
      data: records,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
      page,
      pageSize,
      message: "Employees fetched successfully",
    });
  } catch (error) {
    console.error(error);
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
      include: {
        jobs: { orderBy: { createdAt: "desc" } },
        _count: { select: { jobs: true } },
      },
    });
    if (!record) {
      return res.status(404).json({ error: "Employee not found" });
    }

    let invoices: unknown[] = [];
    let payments: unknown[] = [];

    try {
      invoices = await prisma.invoice.findMany({
        where: { employeeId: id },
        include: { job: { select: { id: true, title: true } } },
        orderBy: { createdAt: "desc" },
      });
      payments = await prisma.payment.findMany({
        where: { employeeId: id },
        include: { invoice: { select: { id: true, number: true } } },
        orderBy: { paidAt: "desc" },
      });
    } catch (relatedError) {
      console.warn(
        "Invoice/Payment tables unavailable yet; returning empty lists.",
        relatedError,
      );
    }

    return res.status(200).json({
      data: { ...record, invoices, payments },
      message: "Employee fetched successfully",
    });
  } catch (error) {
    console.error(error);
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
