<<<<<<< HEAD
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import recordsRouter from "./routes/recordsRouter.js";
=======
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import recordsRouter from './routes/recordsRouter.js';
>>>>>>> 5ab528c1a82b5e1e5ec262d4df4c5fb13a18037f

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
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
=======

mongoose.connect(process.env.MONGO_URI)
  .then(() => {console.log("✅ MongoDB connected successfully to:", mongoose.connection.name)})
  .catch ((err) => {
    console.log("MongoDB connection failed: " + err)
  })

app.use('/GlucoMeter', recordsRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
>>>>>>> 5ab528c1a82b5e1e5ec262d4df4c5fb13a18037f
