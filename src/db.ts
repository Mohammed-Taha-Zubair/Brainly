import moongoose, { model, Schema } from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = model("User", UserSchema);

const contentSchema = new Schema({
  title: String,
  link: String,
  tag: [{ type: moongoose.Types.ObjectId, ref: "Tag" }],
  userId: [{ type: moongoose.Types.ObjectId, ref: "User", required: true }],
});

export const ContentModel = model("Content", contentSchema);
