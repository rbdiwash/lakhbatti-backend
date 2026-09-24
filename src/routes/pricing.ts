import { Router } from "express";
import { prisma } from "../lib/prisma.ts";
import { DEFAULT_PRICING, conformPricing, loadPricing } from "../lib/pricing.ts";

const router = Router();

// Public: the website quote form reads the call-out fee from here.
router.get("/", async (_req, res) => {
  try {
    const { config, updatedAt } = await loadPricing();
    return res.status(200).json({
      data: { config, updatedAt },
      message: "Pricing fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

router.get("/defaults", (_req, res) => {
  return res.status(200).json({ data: { config: DEFAULT_PRICING } });
});

router.put("/", async (req, res) => {
  try {
    const config = conformPricing(req.body?.config);
    const row = await prisma.pricingSettings.upsert({
      where: { id: "default" },
      create: { id: "default", config },
      update: { config },
    });
    return res.status(200).json({
      data: { config, updatedAt: row.updatedAt },
      message: "Pricing saved",
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
