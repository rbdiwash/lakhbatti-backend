import { prisma } from "./prisma.ts";

// Keep in sync with lakhbatti-frontend/app/lib/types.ts (PricingConfig).

export const PRICE_UNITS = [
  "flat",
  "per_item",
  "per_room",
  "per_hour",
  "per_sqm",
] as const;
export type PriceUnit = (typeof PRICE_UNITS)[number];

export type PriceItem = {
  id: string;
  name: string;
  price: number;
  unit: PriceUnit;
  enabled: boolean;
};

export type PricingConfig = {
  general: {
    gstRegistered: boolean;
    gstRate: number;
    pricesIncludeGst: boolean;
    minimumCharge: number;
    roundTo: number;
    quoteValidityDays: number;
    depositPercent: number;
    paymentTermsDays: number;
    cancellationNoticeHours: number;
    cancellationFee: number;
  };
  callOut: {
    enabled: boolean;
    amount: number;
    deductible: boolean;
    /** Waive the call-out fee when the job total reaches this amount (0 = never). */
    waiveAbove: number;
    notes: string;
  };
  cleaning: {
    types: {
      id: string;
      name: string;
      basePrice: number;
      includedRooms: number;
      extraRoomPrice: number;
      enabled: boolean;
    }[];
    bathroomTiers: { count: number; price: number }[];
    bathroomAdditional: number;
    kitchenFirst: number;
    kitchenAdditional: number;
    laundry: number;
    propertyAdjustments: { id: string; name: string; adjustPercent: number }[];
    addons: PriceItem[];
  };
  gardening: {
    types: {
      id: string;
      name: string;
      hourlyRate: number;
      minimumHours: number;
      enabled: boolean;
    }[];
    sizes: { id: string; name: string; estimatedHours: number }[];
    tasks: PriceItem[];
    addons: PriceItem[];
  };
  mowing: {
    sizes: { id: string; name: string; price: number }[];
    extras: PriceItem[];
    addons: PriceItem[];
    minimumCharge: number;
  };
  frequencyDiscounts: { id: string; name: string; discountPercent: number }[];
  surcharges: {
    weekendPercent: number;
    publicHolidayPercent: number;
    afterHoursPercent: number;
    urgentFee: number;
    travelFreeKm: number;
    travelPerKm: number;
  };
};

const item = (
  id: string,
  name: string,
  price: number,
  unit: PriceUnit = "flat",
): PriceItem => ({ id, name, price, unit, enabled: true });

export const DEFAULT_PRICING: PricingConfig = {
  general: {
    gstRegistered: true,
    gstRate: 10,
    pricesIncludeGst: true,
    minimumCharge: 99,
    roundTo: 5,
    quoteValidityDays: 14,
    depositPercent: 0,
    paymentTermsDays: 7,
    cancellationNoticeHours: 24,
    cancellationFee: 50,
  },
  callOut: {
    enabled: true,
    amount: 49,
    deductible: true,
    waiveAbove: 0,
    notes:
      "Charged for on-site quote visits; deducted from the final job invoice.",
  },
  cleaning: {
    // Names match the options on the public quote form.
    types: [
      {
        id: "general",
        name: "General Cleaning",
        basePrice: 120,
        includedRooms: 2,
        extraRoomPrice: 25,
        enabled: true,
      },
      {
        id: "end-of-lease",
        name: "End of Lease Cleaning",
        basePrice: 280,
        includedRooms: 1,
        extraRoomPrice: 60,
        enabled: true,
      },
      {
        id: "deep",
        name: "Deep Cleaning",
        basePrice: 220,
        includedRooms: 1,
        extraRoomPrice: 45,
        enabled: true,
      },
    ],
    bathroomTiers: [
      { count: 1, price: 45 },
      { count: 2, price: 80 },
      { count: 3, price: 110 },
    ],
    bathroomAdditional: 30,
    kitchenFirst: 50,
    kitchenAdditional: 40,
    laundry: 25,
    propertyAdjustments: [
      { id: "house", name: "House", adjustPercent: 0 },
      { id: "apartment", name: "Apartment", adjustPercent: 0 },
      { id: "office", name: "Office", adjustPercent: 15 },
      { id: "other", name: "Other", adjustPercent: 0 },
    ],
    addons: [
      item("oven", "Oven clean", 60, "per_item"),
      item("fridge", "Fridge & freezer (inside)", 40, "per_item"),
      item("rangehood", "Range hood & filters", 30),
      item("microwave", "Microwave (inside)", 15),
      item("cupboards", "Inside cupboards & drawers", 40),
      item("windows-int", "Interior windows", 8, "per_item"),
      item("windows-ext", "Exterior windows (ground level)", 10, "per_item"),
      item("blinds", "Blinds / shutters", 15, "per_item"),
      item("carpet", "Carpet steam clean", 45, "per_room"),
      item("walls", "Wall spot cleaning", 30, "per_room"),
      item("mould", "Mould treatment", 40, "per_room"),
      item("balcony", "Balcony / patio", 35),
      item("garage", "Garage sweep-out", 50),
      item("pet-hair", "Pet hair removal", 30),
      item("rubbish", "Rubbish removal", 60),
      item("pressure", "Pressure washing", 8, "per_sqm"),
      item("heavy", "Heavy soiling (extra labour)", 55, "per_hour"),
    ],
  },
  gardening: {
    types: [
      {
        id: "light",
        name: "Light Gardening",
        hourlyRate: 60,
        minimumHours: 2,
        enabled: true,
      },
      {
        id: "landscaping",
        name: "Landscaping",
        hourlyRate: 85,
        minimumHours: 4,
        enabled: true,
      },
      {
        id: "maintenance",
        name: "Garden Maintenance",
        hourlyRate: 55,
        minimumHours: 2,
        enabled: true,
      },
    ],
    sizes: [
      { id: "small", name: "Small", estimatedHours: 2 },
      { id: "medium", name: "Medium", estimatedHours: 3 },
      { id: "large", name: "Large", estimatedHours: 5 },
    ],
    tasks: [
      item("weeding", "Weeding", 0),
      item("pruning", "Pruning", 20),
      item("hedge", "Hedge trimming", 40),
      item("planting", "Planting", 30),
      item("rubbish", "Rubbish removal", 60),
    ],
    addons: [
      item("green-bag", "Green waste (per bag)", 15, "per_item"),
      item("trailer", "Trailer load disposal", 120),
      item("mulch", "Mulch supply & spread", 12, "per_sqm"),
      item("fertilise", "Fertilising", 40),
      item("gutters", "Gutter cleaning", 90),
      item("tree", "Small tree lopping", 80, "per_item"),
    ],
  },
  mowing: {
    sizes: [
      { id: "small", name: "Small", price: 50 },
      { id: "medium", name: "Medium", price: 70 },
      { id: "large", name: "Large", price: 110 },
    ],
    extras: [
      item("edging", "Edging", 10),
      item("whipper", "Whipper snipping", 15),
      item("green-waste", "Green waste removal", 20),
    ],
    addons: [
      item("weed-spray", "Weed spraying", 35),
      item("fertilise", "Lawn fertilising", 40),
      item("aeration", "Aeration", 60),
      item("leaf-blow", "Leaf blowing & clean-up", 15),
    ],
    minimumCharge: 50,
  },
  frequencyDiscounts: [
    { id: "one-off", name: "One-off", discountPercent: 0 },
    { id: "weekly", name: "Weekly", discountPercent: 15 },
    { id: "fortnightly", name: "Fortnightly", discountPercent: 10 },
    { id: "monthly", name: "Monthly", discountPercent: 5 },
  ],
  surcharges: {
    weekendPercent: 15,
    publicHolidayPercent: 50,
    afterHoursPercent: 20,
    urgentFee: 40,
    travelFreeKm: 15,
    travelPerKm: 1.5,
  },
};

// ─── Sanitising ──────────────────────────────────────────────────────────────
// Stored/incoming config is conformed to the default shape, so new fields added
// later get their defaults and bad input never reaches the pricing maths.

type Obj = Record<string, unknown>;

function obj(v: unknown): Obj {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Obj) : {};
}

function num(v: unknown, fallback: number, min = 0, max = 1_000_000) {
  const n = typeof v === "string" && v.trim() === "" ? NaN : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n * 100) / 100));
}

function bool(v: unknown, fallback: boolean) {
  return typeof v === "boolean" ? v : fallback;
}

function str(v: unknown, fallback: string, maxLength = 500) {
  return typeof v === "string" ? v.trim().slice(0, maxLength) : fallback;
}

/** Rows that mirror public form options: keep default rows, overlay values by id. */
function fixedList<T extends { id: string }>(
  input: unknown,
  defaults: T[],
  conform: (raw: Obj, def: T) => T,
): T[] {
  const byId = new Map(
    (Array.isArray(input) ? input : []).map((raw) => [obj(raw).id, obj(raw)]),
  );
  return defaults.map((def) => conform(byId.get(def.id) ?? {}, def));
}

/** Admin-editable lists (add / remove rows). */
function customList<T>(
  input: unknown,
  defaults: T[],
  conform: (raw: Obj) => T | null,
  max = 60,
): T[] {
  if (!Array.isArray(input)) return defaults;
  return input
    .map((raw) => conform(obj(raw)))
    .filter((row): row is T => row !== null)
    .slice(0, max);
}

function priceItem(raw: Obj, def?: PriceItem): PriceItem | null {
  const name = str(raw.name, def?.name ?? "", 120);
  if (!name) return null;
  const unit = PRICE_UNITS.includes(raw.unit as PriceUnit)
    ? (raw.unit as PriceUnit)
    : (def?.unit ?? "flat");
  return {
    id: str(raw.id, def?.id ?? "", 80) || `item-${Math.random().toString(36).slice(2, 10)}`,
    name,
    price: num(raw.price, def?.price ?? 0),
    unit,
    enabled: bool(raw.enabled, def?.enabled ?? true),
  };
}

export function conformPricing(input: unknown): PricingConfig {
  const d = DEFAULT_PRICING;
  const root = obj(input);

  const g = obj(root.general);
  const c = obj(root.callOut);
  const cl = obj(root.cleaning);
  const ga = obj(root.gardening);
  const mo = obj(root.mowing);
  const su = obj(root.surcharges);

  return {
    general: {
      gstRegistered: bool(g.gstRegistered, d.general.gstRegistered),
      gstRate: num(g.gstRate, d.general.gstRate, 0, 100),
      pricesIncludeGst: bool(g.pricesIncludeGst, d.general.pricesIncludeGst),
      minimumCharge: num(g.minimumCharge, d.general.minimumCharge),
      roundTo: num(g.roundTo, d.general.roundTo, 0, 1000),
      quoteValidityDays: num(g.quoteValidityDays, d.general.quoteValidityDays, 0, 365),
      depositPercent: num(g.depositPercent, d.general.depositPercent, 0, 100),
      paymentTermsDays: num(g.paymentTermsDays, d.general.paymentTermsDays, 0, 365),
      cancellationNoticeHours: num(
        g.cancellationNoticeHours,
        d.general.cancellationNoticeHours,
        0,
        720,
      ),
      cancellationFee: num(g.cancellationFee, d.general.cancellationFee),
    },
    callOut: {
      enabled: bool(c.enabled, d.callOut.enabled),
      amount: num(c.amount, d.callOut.amount),
      deductible: bool(c.deductible, d.callOut.deductible),
      waiveAbove: num(c.waiveAbove, d.callOut.waiveAbove),
      notes: str(c.notes, d.callOut.notes),
    },
    cleaning: {
      types: fixedList(cl.types, d.cleaning.types, (raw, def) => ({
        ...def,
        basePrice: num(raw.basePrice, def.basePrice),
        includedRooms: num(raw.includedRooms, def.includedRooms, 0, 50),
        extraRoomPrice: num(raw.extraRoomPrice, def.extraRoomPrice),
        enabled: bool(raw.enabled, def.enabled),
      })),
      bathroomTiers: customList(
        cl.bathroomTiers,
        d.cleaning.bathroomTiers,
        (raw) => {
          const count = num(raw.count, NaN, 1, 50);
          return Number.isFinite(count)
            ? { count: Math.round(count), price: num(raw.price, 0) }
            : null;
        },
        20,
      )
        .filter((t, i, all) => all.findIndex((x) => x.count === t.count) === i)
        .sort((a, b) => a.count - b.count),
      bathroomAdditional: num(cl.bathroomAdditional, d.cleaning.bathroomAdditional),
      kitchenFirst: num(cl.kitchenFirst, d.cleaning.kitchenFirst),
      kitchenAdditional: num(cl.kitchenAdditional, d.cleaning.kitchenAdditional),
      laundry: num(cl.laundry, d.cleaning.laundry),
      propertyAdjustments: fixedList(
        cl.propertyAdjustments,
        d.cleaning.propertyAdjustments,
        (raw, def) => ({
          ...def,
          adjustPercent: num(raw.adjustPercent, def.adjustPercent, -100, 500),
        }),
      ),
      addons: customList(cl.addons, d.cleaning.addons, (raw) => priceItem(raw)),
    },
    gardening: {
      types: fixedList(ga.types, d.gardening.types, (raw, def) => ({
        ...def,
        hourlyRate: num(raw.hourlyRate, def.hourlyRate),
        minimumHours: num(raw.minimumHours, def.minimumHours, 0, 100),
        enabled: bool(raw.enabled, def.enabled),
      })),
      sizes: fixedList(ga.sizes, d.gardening.sizes, (raw, def) => ({
        ...def,
        estimatedHours: num(raw.estimatedHours, def.estimatedHours, 0, 100),
      })),
      tasks: fixedList(
        ga.tasks,
        d.gardening.tasks,
        (raw, def) => priceItem({ ...raw, id: def.id, name: def.name }, def) ?? def,
      ),
      addons: customList(ga.addons, d.gardening.addons, (raw) => priceItem(raw)),
    },
    mowing: {
      sizes: fixedList(mo.sizes, d.mowing.sizes, (raw, def) => ({
        ...def,
        price: num(raw.price, def.price),
      })),
      extras: fixedList(
        mo.extras,
        d.mowing.extras,
        (raw, def) => priceItem({ ...raw, id: def.id, name: def.name }, def) ?? def,
      ),
      addons: customList(mo.addons, d.mowing.addons, (raw) => priceItem(raw)),
      minimumCharge: num(mo.minimumCharge, d.mowing.minimumCharge),
    },
    frequencyDiscounts: fixedList(
      root.frequencyDiscounts,
      d.frequencyDiscounts,
      (raw, def) => ({
        ...def,
        discountPercent: num(raw.discountPercent, def.discountPercent, 0, 100),
      }),
    ),
    surcharges: {
      weekendPercent: num(su.weekendPercent, d.surcharges.weekendPercent, 0, 500),
      publicHolidayPercent: num(
        su.publicHolidayPercent,
        d.surcharges.publicHolidayPercent,
        0,
        500,
      ),
      afterHoursPercent: num(
        su.afterHoursPercent,
        d.surcharges.afterHoursPercent,
        0,
        500,
      ),
      urgentFee: num(su.urgentFee, d.surcharges.urgentFee),
      travelFreeKm: num(su.travelFreeKm, d.surcharges.travelFreeKm, 0, 1000),
      travelPerKm: num(su.travelPerKm, d.surcharges.travelPerKm),
    },
  };
}

/**
 * Current pricing. The first read seeds the call-out fee from the legacy
 * CalloutFee settings row so existing values carry over.
 */
export async function loadPricing() {
  const row = await prisma.pricingSettings.findUnique({
    where: { id: "default" },
  });
  if (row) return { config: conformPricing(row.config), updatedAt: row.updatedAt };

  const legacy = await prisma.calloutFee
    .findUnique({ where: { id: "default" } })
    .catch(() => null);
  const config = conformPricing({
    callOut: legacy
      ? { amount: legacy.amount, enabled: legacy.enabled, notes: legacy.notes }
      : undefined,
  });
  return { config, updatedAt: null };
}
