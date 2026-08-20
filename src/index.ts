import "dotenv/config";
import express, { json } from "express";
import mongoose from "mongoose";
import { UserModel } from "./db.js";

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("MONGO_URI environment variable is missing");
}

const connectDB = async () => {
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");
};

connectDB();

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({
      username: username,
      password: password,
    });

    res.json({
      messaage: "User signed in",
    });
  } catch (e) {
    res.status(411).json({
      message: "user already exists",
    });
  }
});

app.post("/api/v1/signin", (req, res) => {});

app.post("/api/v1/content", (req, res) => {});

app.get("/api/v1/content", (req, res) => {});

app.delete("/api/v1/content", (req, res) => {});

app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/shareLink", (req, res) => {});

app.listen(3000, () => {
  console.log("server started at port:3000");
});
