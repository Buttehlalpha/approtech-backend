import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// STATIC FOLDER
app.use(
  "/uploads",
  express.static("uploads")
);

// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(
      process.env.PORT || 5000,
      () => {
        console.log(
          `Server running on port ${
            process.env.PORT || 5000
          }`
        );
      }
    );
  })
  .catch((err) => {
    console.log(err);
  });