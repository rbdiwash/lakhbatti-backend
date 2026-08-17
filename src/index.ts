import express from "express";
import { prisma } from "./lib/prisma.ts";
import cors from "cors";
import employeeRoutes from "./routes/employee.ts";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use("/api/employee", employeeRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
