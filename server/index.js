import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import recordsRouter from './routes/recordsRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => {console.log("✅ MongoDB connected successfully to:", mongoose.connection.name)})
  .catch ((err) => {
    console.log("MongoDB connection failed: " + err)
  })

app.use('/GlucoMeter', recordsRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})