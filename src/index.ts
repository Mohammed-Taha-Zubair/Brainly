import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_PAssword } from "./config.js";
import { ContentModel, UserModel } from "./db.js";
import { userMiddleWare } from "./middleware.js";


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
      message: "User signed up",
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await UserModel.findOne({ username, password });

  if (!existingUser) {
    res.status(403).json({
      message: "Incorrect credentials",
    });
    return;
  }
  const token = jwt.sign({ id: existingUser._id }, JWT_PAssword);
  res.status(200).json({
    token: token,
  });
});

app.post("/api/v1/content", userMiddleWare, async (req, res) => {
  const title = req.body.title;
  const link = req.body.link;
  const tags = req.body.tags;

  if (!req.userId) {
    res.status(403).json({
      message: "You are not logged in",
    });
    return;
  }

  await ContentModel.create({
    title,
    link,
    tag: tags || [],
    userId: req.userId,
  });

  res.json({
    message: "Content added",
  });
});

app.get("/api/v1/content", userMiddleWare, async (req, res) => {
  if (!req.userId) {
    res.status(403).json({
      message: "You are not logged in",
    });
    return;
  }

  const content = await ContentModel.find({
    userId: req.userId,
  }).populate("userId", "username");

  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleWare, async (req, res) => {
  const contentId = req.body.contentId;

  if (!req.userId) {
    res.status(403).json({
      message: "You are not logged in",
    });
    return;
  }

  await ContentModel.deleteMany({
    _id: contentId,
    userId: req.userId,
  });

  res.json({
    message: "Deleted",
  });
});

app.post("/api/v1/brain/share", (req, res) => {
  const share = req.body.share
});

app.get("/api/v1/brain/shareLink", (req, res) => {});

app.listen(3000, () => {
  console.log("server started at port:3000");
});


