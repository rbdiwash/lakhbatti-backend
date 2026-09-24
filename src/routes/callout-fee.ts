import { Router } from "express";
import { prisma } from "../lib/prisma.ts";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const record = await prisma.calloutFee.upsert({
      where: {
        id: "default",
      },
      create: {
        id: "default",
      },
      update: {},
    });

    return res.status(200).json({
      data: record,
      message: "Call-out fee fetched successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error",
      message: error?.message ?? "Internal Server Error",
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const { amount, enabled, deductible, waiveAbove, notes } = req.body;

    const record = await prisma.calloutFee.upsert({
      where: {
        id: "default",
      },

      create: {
        id: "default",
        amount,
        enabled,
        deductible,
        waiveAbove,
        notes,
      },

      update: {
        amount,
        enabled,
        deductible,
        waiveAbove,
        notes,
      },
    });

    return res.status(200).json({
      data: record,
      message: "Call-out fee updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: "Internal server error",
      message: error?.message ?? "Internal Server Error",
    });
  }
});

export default router;
