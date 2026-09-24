import { Router } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.ts";
import { asString } from "../helper/helper.ts";
import { loadPricing } from "../lib/pricing.ts";

const router = Router();

const QUOTE_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "ACCEPTED",
  "DECLINED",
] as const;

const MAX_IMAGES = 8;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// List responses omit the (large) image payloads; the detail route returns them.
const listOmit = { images: true } as const;

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

// Public: the website quote form posts here.
router.post("/", async (req, res) => {
  try {
    const body = req.body ?? {};
    const name = text(body.name);
    const email = text(body.email).toLowerCase();
    const category = text(body.category);

    if (!name) return res.status(400).json({ message: "Name is required." });
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "A valid email is required." });
    }
    if (!category) {
      return res.status(400).json({ message: "Service category is required." });
    }

    const images = Array.isArray(body.images)
      ? body.images
          .filter(
            (img: unknown): img is string =>
              typeof img === "string" && img.startsWith("data:image/"),
          )
          .slice(0, MAX_IMAGES)
      : [];

    const details =
      body.details && typeof body.details === "object" ? body.details : {};
    const quoteMode = text(body.quoteMode);
    // Record the fee from current settings, not whatever the client sent.
    const callOutFee =
      quoteMode === "site-visit"
        ? await loadPricing()
            .then(({ config }) =>
              config.callOut.enabled ? config.callOut.amount : 0,
            )
            .catch(() => null)
        : null;

    const quote = await prisma.quote.create({
      data: {
        category,
        serviceType: text(body.serviceType),
        details,
        dateFrom: text(body.dateFrom),
        dateTo: text(body.dateTo),
        frequency: text(body.frequency),
        quoteMode,
        callOutAccepted: body.callOutAccepted === true,
        callOutFee,
        name,
        email,
        phone: text(body.phone),
        address: text(body.address),
        images,
        imageCount: images.length,
      },
      omit: listOmit,
    });

    return res.status(201).json({
      id: quote.id,
      data: quote,
      message: "Quote request received",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const status = asString(req.query.status);
    const category = asString(req.query.category);
    const search = asString(req.query.search);

    const where: Prisma.QuoteWhereInput = {};
    if (status && QUOTE_STATUSES.includes(status as never)) {
      where.status = status as (typeof QUOTE_STATUSES)[number];
    }
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { address: { contains: search, mode: "insensitive" } },
        { serviceType: { contains: search, mode: "insensitive" } },
      ];
    }

    const quotes = await prisma.quote.findMany({
      where,
      omit: listOmit,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      data: quotes,
      message: "Quotes fetched successfully",
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
    const quote = await prisma.quote.findUnique({
      where: { id: req.params.id },
      include: { job: { select: { id: true, title: true, status: true } } },
    });
    if (!quote) return res.status(404).json({ message: "Quote not found." });

    return res.status(200).json({
      data: quote,
      message: "Quote fetched successfully",
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
    const { status, quotedAmount, adminNotes } = req.body ?? {};

    if (status !== undefined && !QUOTE_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid quote status." });
    }

    const existing = await prisma.quote.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return res.status(404).json({ message: "Quote not found." });

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(quotedAmount !== undefined && {
          quotedAmount: String(quotedAmount).trim(),
        }),
        ...(adminNotes !== undefined && {
          adminNotes: String(adminNotes).trim(),
        }),
      },
      include: { job: { select: { id: true, title: true, status: true } } },
    });

    return res.status(200).json({
      data: quote,
      message: "Quote updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

// Turn an accepted quote into a job and link the two.
router.post("/:id/convert", async (req, res) => {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: req.params.id },
      omit: listOmit,
    });
    if (!quote) return res.status(404).json({ message: "Quote not found." });
    if (quote.jobId) {
      return res
        .status(409)
        .json({ message: "This quote has already been converted to a job." });
    }

    const scheduledDate = quote.dateFrom ? new Date(quote.dateFrom) : null;
    const description = [
      quote.serviceType,
      quote.frequency && `Frequency: ${quote.frequency}`,
      `Customer: ${quote.name} (${quote.email}${quote.phone ? `, ${quote.phone}` : ""})`,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          title: `${quote.serviceType || quote.category} — ${quote.name}`,
          category: quote.category,
          description,
          address: quote.address,
          scheduledDate:
            scheduledDate && !Number.isNaN(scheduledDate.getTime())
              ? scheduledDate
              : null,
          notes: quote.quotedAmount ? `Quoted: ${quote.quotedAmount}` : "",
        },
      });
      const updated = await tx.quote.update({
        where: { id: quote.id },
        data: { jobId: job.id, status: "ACCEPTED" },
        include: { job: { select: { id: true, title: true, status: true } } },
      });
      return updated;
    });

    return res.status(201).json({
      data: result,
      message: "Job created from quote",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.quote.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return res.status(404).json({ message: "Quote not found." });

    await prisma.quote.delete({ where: { id } });
    return res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Internal Server Error",
    });
  }
});

export default router;
