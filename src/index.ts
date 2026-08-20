import "dotenv/config";
import express, { json } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "./db.js";

const JWT_PAssword = "12452y26534";

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
      message: "User signed in",
    });
  } catch (e) {
    res.status(411).json({
      message: "user already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await UserModel.findOne({ username, password });

  if (!existingUser) {
    res.status(401).json({
      message: "User Already exists",
    });
    return;
  }
  const token = jwt.sign({ id: existingUser._id }, JWT_PAssword);
  res.status(200).json({
    token: token,
  });
});

app.post("/api/v1/content", (req, res) => {
  const title = req.body.title;
  const type = req.body.type;
  const link = req.body.link;
});

app.get("/api/v1/content", (req, res) => { });

app.delete("/api/v1/content", (req, res) => { });

app.post("/api/v1/brain/share", (req, res) => { });

app.get("/api/v1/brain/shareLink", (req, res) => { });

app.listen(3000, () => {
  console.log("server started at port:3000");
});
