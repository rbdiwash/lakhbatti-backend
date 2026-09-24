import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.ts";
import jobRoutes from "./routes/job.ts";
import calloutFeeRoutes from "./routes/callout-fee.ts";
import quoteRoutes from "./routes/quote.ts";
import pricingRoutes from "./routes/pricing.ts";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/employee", employeeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/settings/pricing", pricingRoutes);
app.use("/api/settings/call-out-fee", calloutFeeRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
  console.log("http://localhost:8000");
});
