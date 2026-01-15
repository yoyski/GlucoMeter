import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import recordsRouter from "./routes/recordsRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/GlucoMeter", recordsRouter);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Mongodb connected");
    app.listen(PORT, () => {
      console.log("🚀 Server is running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
